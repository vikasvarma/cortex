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
import Sample from './Sample';
import Label from './Label';
import LabelBrowser from './LabelBrowser';

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
const path = window.require('path');

class Labeler extends Component {

    state = {
        dataset: {},
        image: "",
        current: 0,
        tool: 'select',
        labels: [],
    }

    setTool(value) {
        this.setState({ tool: value });
    }

    componentDidMount() {
        const { dataset } = this.props;
        if (dataset != undefined) {
            if (dataset.constructor == Array) {
                dataset = dataset[0]; // Only one dataset can be loaded.
            }
            this.loadSample(this.getSample(0))
        }
    }

    getSample = (index) => {
        const { dataset } = this.props;
        if (
            Object.keys(dataset).length > 0 &&
            dataset.hasOwnProperty('samples') &&
            dataset.samples.constructor == Array &&
            dataset.samples.length > 0
        ) { 
            return dataset.samples[index];
        } else {
            return null;
        }
    }

    loadSample = (sample) => {

        const { dataset, userid } = this.props;
        var filename = path.join(
            "file://", dataset.path, sample.path
        );

        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {
                this.setState({ image: event.target.result });
            }, false);
        };
        request.send();

        /* Now also load the labels associated with the sample.
        const promise = controller.get('label', {
            userid: userid,
            dataid: dataset.id,
            sampleid: sample.id
        });

        promise.then((labelData) => {
            this.setState({ labels: labelData })
        });
        */
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

        const {dataset} = this.props;
        const sample = this.getSample(this.state.current);

        return (
            <Grid
                style={{
                    gridTemplateRows: "3.5rem auto",
                    gridTemplateColumns: "4rem auto 20rem"
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
                                        key={dataset.id}
                                        className={`
                                            h-6
                                            flex items-center justify-start
                                            border-r-2
                                        `}
                                    >
                                        <DatasetName>
                                        {
                                            dataset.hasOwnProperty('name') &&  dataset.name
                                        }
                                        </DatasetName>
                                    </li>
                                    <li>
                                        <SampleName>
                                            {sample != null ? sample.path : ""}
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
                <div className="flex flex-col row-start-2 col-start-2 px-6 py-6 overflow-hidden"
                >
                    <div className="flex overflow-hidden h-full rounded-sm border-b border-gray-200"
                        style={{
                            maxHeight: "calc(100vh - 350px)"
                        }}
                    >
                        <div className="object-scale-down"
                            style={{
                                maxHeight: "calc(100vh - 350px)"
                            }}
                        >
                            <ImageAnnotator
                                sample={this.state.sample}
                                labels={this.state.labels}
                                source={this.state.image}
                                onDrawFinish={this.addROI.bind(this)}
                            />
                        </div>
                    </div>
                    <div className="flex overflow-x-scroll">
                        {Object.keys(this.state.dataset).length > 0 &&
                            <div className="pr-1 pt-3 flex flex-row">
                                {[].map(
                                    (sample, idx) => (
                                        <div className="flex pr-2">
                                            <Sample
                                                sample={sample}
                                                style={{
                                                    width: "180px",
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
                <div className="col-start-3 row-start-2 flex overflow-hidden">
                    <LabelBrowser
                        labels={this.state.labels}
                        image={this.state.data}
                    />
                </div>
            </Grid>
        );
    }
};

export default Labeler;