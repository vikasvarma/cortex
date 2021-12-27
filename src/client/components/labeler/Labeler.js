/**
 * 
 */
import React, { Component } from 'react';
import { RadioGroup } from '@headlessui/react'
import {
    HiOutlineMenu,
    HiOutlineFolderOpen,
    HiOutlineCheck,
    HiOutlineDocumentSearch
} from "react-icons/hi";
import { BiCommentDetail } from 'react-icons/bi';
import {
    Grid,
    Cell,
    ToolbarContainer,
    ToolbarButton,
    BreadCrumb,
    CloseButton,
    LabelToolContainer,
    LabelToolIcon,
    SampleName,
    DatasetName
} from './labeler.styles';

import {
    RiPenNibLine,
    RiShapeLine,
    RiCheckboxBlankCircleLine,
    RiBrushLine,
    RiEraserLine
} from 'react-icons/ri';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { BiShapeTriangle } from 'react-icons/bi';
import { AiOutlineSelect } from 'react-icons/ai';
import ImageAnnotator from './ImageAnnotator';
import ServerDispatcher from '../../Dispatcher';
import InfiniteScroll from 'react-infinite-scroll-component';
import Sample from '../cards/Sample';
import Label from '../cards/Label';

let iconStyle = "w-5 h-5";
const LabelerTools = [
    {
        id: 'select',
        icon: <AiOutlineSelect className={iconStyle} />,
        ref: '/select'
    },
    {
        id: 'box',
        icon: <RiShapeLine className={iconStyle} />,
        ref: "/box"
    },
    {
        id: 'freehand',
        icon: <RiPenNibLine className={iconStyle} />,
        ref: "/freehand"
    },
    {
        id: 'polygon',
        icon: <BiShapeTriangle className={iconStyle} />,
        ref: "/polygon"
    },
    {
        id: 'circle',
        icon: <RiCheckboxBlankCircleLine className={iconStyle} />,
        ref: "/circle"
    },
    {
        id: 'paint',
        icon: <RiBrushLine className={iconStyle} />,
        ref: "/paint"
    },
    {
        id: 'eraser',
        icon: <RiEraserLine className={iconStyle} />,
        ref: "/eraser"
    },
    {
        id: 'swap',
        icon: <HiOutlineSwitchHorizontal className={iconStyle} />,
        ref: "/swap"
    }
];

const controller = new ServerDispatcher();

class Labeler extends Component {

    state = {
        dataset: {},
        data: "",
        sample: 0,
        tool: 'select',
        labels: [],
    }

    setTool(value) {
        this.setState({ tool: value });
    }

    componentDidMount() {
        // Load sample information from the server:
        const { user, dataset } = this.props;
        var promise = controller.get('dataset', {
            userid: user,
            dataid: dataset
        })

        promise.then((data) => {
            // Parse sample information from data and load it.
            if (data != undefined) {
                if (data.constructor == Array) {
                    data = data[0]; // Only one dataset can be loaded.
                }

                if (
                    Object.keys(data).length > 0 &&
                    data.hasOwnProperty('samples') &&
                    data.samples.constructor == Array &&
                    data.samples.length > 0
                ) {
                    data.samples.forEach(function (sample, index) {
                        data.samples[index].path = "file://" + sample.path;
                    })
                    this.setState({
                        dataset: data,
                        sample: 0,
                    });
                    this.loadSample();

                } else {
                    // No samples
                    this.setState({ dataset: data })
                }
            }
        })
    }

    loadSample() {

        const sample = this.state.dataset.samples[this.state.sample];
        const filename = sample.path;

        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {
                this.setState({ data: event.target.result });
            }, false);
        };
        request.send();

        // Now also load the labels associated with the sample.
        const promise = controller.get('label', {
            userid: this.props.user,
            dataid: this.props.dataset,
            sampleid: sample.id
        });

        promise.then((labelData) => {
            this.setState({ labels: labelData })
        });
    }

    addROI(payload) {
        // Construct the JSON to send to the server:
        var coordinates = [
            Math.min(payload.position[0], payload.position[1]),
            Math.max(payload.position[0], payload.position[1]),
            Math.min(payload.position[2], payload.position[3]),
            Math.max(payload.position[2], payload.position[3]),
        ]
        var json = {
            userid: this.props.user,
            dataid: this.props.dataset,
            sampleid: this.state.dataset.samples[this.state.sample].id,
            labeldef: payload.labeldef,
            type: payload.type,
            position: coordinates,
        }

        const promise = controller.send('PUT', 'label', json);
        promise.then(labels => {
            if (labels.constructor == Array) {
                this.setState({
                    labels: this.state.labels.concat(labels)
                })

            } else {
                this.state.labels.push(labels)
                this.setState({ labels: this.state.labels })
            }
        })
    }

    render() {
        return (
            <Grid
                style={{
                    gridTemplateRows: "3.5rem auto",
                    gridTemplateColumns: "4rem auto 15rem"
                }}
            >
                <Cell className="row-start-1 col-span-full">
                    <ToolbarContainer
                        style={{
                            gridTemplateRows: "3.5rem 1fr",
                            gridTemplateColumns: "4rem 1fr 12rem 3.5rem"
                        }}
                    >
                        <CloseButton>
                            <HiOutlineFolderOpen
                                className={`
                                    align-middle 
                                    justify-center 
                                    w-5 h-5
                                `} />
                        </CloseButton>
                        <Cell className="row-start-1 col-start-2">
                            <nav className="flex align-middle">
                                <BreadCrumb role="list">
                                    <li
                                        key={this.props.dataset}
                                        className={`
                                            h-6
                                            flex items-center justify-start
                                            border-r-2
                                        `}
                                    >
                                        <DatasetName>
                                            {this.state.dataset.hasOwnProperty('name') && this.state.dataset.name}
                                        </DatasetName>
                                    </li>
                                    <li>
                                        <SampleName>
                                            {Object.keys(this.state.dataset).length > 0 && this.state.dataset.hasOwnProperty('samples') && this.state.dataset.samples.length > 0 && this.state.dataset.samples[this.state.sample].name}
                                        </SampleName>
                                    </li>
                                </BreadCrumb>
                            </nav>
                        </Cell>
                        <Cell className="px-2 justify-end">
                            <ToolbarButton>
                                <HiOutlineCheck className="w-5 h-5" />
                            </ToolbarButton>
                            <ToolbarButton>
                                <HiOutlineDocumentSearch className="w-5 h-5" />
                            </ToolbarButton>
                            <ToolbarButton>
                                <BiCommentDetail className="w-5 h-5" />
                            </ToolbarButton>
                        </Cell>
                        <HiOutlineMenu
                            className={`
                                w-14 h-10
                                text-gray-400
                                row-start-1 col-start-4
                                justify-center
                                px-3 py-2
                                border-l-2
                                hover:text-theme
                            `}
                        />
                    </ToolbarContainer>
                </Cell>
                <LabelToolContainer
                    className="row-start-2 col-start-1 col-span-1"
                >
                    <RadioGroup value={this.state.tool}
                        onChange={this.setTool.bind(this)}>
                        <div className="space-y-4">

                            {LabelerTools.map((entry) => (
                                <RadioGroup.Option
                                    key={entry.id}
                                    value={entry.id}
                                    className="focus:outline-none"
                                    className={({ active, checked }) => `
                                        ${checked
                                            ? 'ring-theme text-theme ring-1'
                                            : 'text-gray-400'
                                        }
                                        focus:outline-none
                                        rounded-sm
                                    `}
                                >
                                    <LabelToolIcon>{entry.icon}</LabelToolIcon>
                                </RadioGroup.Option>
                            ))}

                        </div>
                    </RadioGroup>
                </LabelToolContainer>
                <div className="flex flex-col row-start-2 col-start-2">
                    <div className="px-6 py-6">
                        <div className="overflow-hidden rounded-sm border-b border-gray-200">
                            <div>
                                <ImageAnnotator
                                    sample={this.state.sample}
                                    labels={this.state.labels}
                                    source={this.state.data}
                                    onDrawFinish={this.addROI.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className="overflow-x-scroll row-start-2 bg-theme bg-opacity-0"
                        style={{
                            width: "500px"
                        }}
                    >
                        {Object.keys(this.state.dataset).length > 0 &&
                            <div className="divide-x px-1 py-3 flex flex-row">
                                {this.state.dataset.samples.map(
                                    (sample, idx) => (
                                        <div className="flex px-5 py-3">
                                            <Sample
                                                sample={sample}
                                                style={{
                                                    width: "320px",
                                                    height: "200px"
                                                }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        }
                    </div>
                </div>
                <div className="col-start-3 row-start-2 flex w-full h-3/5 overflow-y-scroll bg-gray-100">
                    {Object.keys(this.state.labels).length > 0 &&
                        <div className="divide-y flex flex-col">
                            {this.state.labels.map(
                                (label, idx) => (
                                    <div className="flex px-5 py-3">
                                        <Label 
                                            key={idx}
                                            label={label} 
                                            image={this.state.data}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    }
                </div>
            </Grid>
        );
    }
};

export default Labeler;