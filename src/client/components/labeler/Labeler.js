/**
 * 
 */
import React, { Component } from 'react';
import tw from 'tailwind-styled-components';
import { RadioGroup } from '@headlessui/react'
import {
    HiOutlineMenu,
    HiOutlineFolderOpen,
    HiOutlineDotsVertical,
    HiOutlineCheck,
    HiOutlineDocumentSearch
} from "react-icons/hi";
import { BiCommentDetail } from 'react-icons/bi';
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

export default class Labeler extends Component {

    constructor(props) {
        super(props);
        this.imageContainer = React.forwardRef();

        this.state = {
            dataset: {
                name: "",
                description: "",
                samples: [],
                classes: [],
            },
            image: "",
            current: 0,
            numThumbnails: 10,
            tool: 'select',
            labels: [],
        }
    }

    setTool(value) {
        this.setState({ tool: value });
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

    loadSample = (index, sample, image) => {

        const { dataset, userid } = this.props;
        const promise = controller.get('label', {
            userid: userid,
            dataid: dataset.id,
            sampleid: sample.id
        });

        promise.then(data => {
            this.setState({
                ...this.state,
                labels: data,
                image: image,
                current: index,
            })
        });

    }

    stepSampleRange = () => {
        // Increment the step counter to load next set of sample cards:
        this.setState({
            numThumbnails: this.state.numThumbnails + 10
        })
    }

    addROI(payload) {
        // Construct the JSON to send to the server:
        const { userid, dataset } = this.props;
        const { current } = this.state;
        var coordinates = [
            Math.min(payload.position[0], payload.position[1]),
            Math.max(payload.position[0], payload.position[1]),
            Math.min(payload.position[2], payload.position[3]),
            Math.max(payload.position[2], payload.position[3]),
        ]
        var json = {
            userid: userid,
            dataid: dataset.id,
            sampleid: dataset.samples[current].id,
            classid: 0,
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

        const { dataset } = this.props;
        const sample = this.getSample(this.state.current);

        return (
            <LabelerContainer
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
                                                dataset.hasOwnProperty('name') && dataset.name
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
                                            ? 'ring-theme5 text-theme5 ring-1'
                                            : 'text-gray-300'
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
                <div
                    className="flex flex-col row-start-2 col-start-2"
                >
                    <div
                        className="flex flex-grow w-full overflow-hidden border-b border-gray-200 px-6 py-6"
                    >
                        <ImageAnnotator
                            sample={this.state.sample}
                            labels={this.state.labels}
                            source={this.state.image}
                            onDrawFinish={this.addROI.bind(this)}
                        />
                    </div>
                    <SampleBrowser
                        samples={dataset.samples}
                        folder={dataset.path}
                        onSampleSelected={this.loadSample}
                        default={0}
                    />
                </div>
                <div className="col-start-3 row-start-2 flex overflow-auto">
                    <LabelBrowser
                        classes={this.state.dataset.classes}
                        labels={this.state.labels}
                        image={this.state.image}
                    />
                </div>
            </LabelerContainer>
        );
    }
};

class SampleBrowser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            size: 10,
            range: [0,0],
            selected: props.default,
        }

        this.unitWidth = 180;

        this.container = React.createRef();
        this.browser = React.createRef();
    }

    scroll = () => {
        const browser = this.browser.current;
        this.setRange();
        if (
            browser.scrollWidth - browser.scrollLeft - browser.clientWidth < 50
        ) {
            this.setState({
                size: this.state.size + 10
            })
        }
    }

    next = () => {
        const browser = this.browser.current;
        browser.scrollLeft += browser.clientWidth;
        this.setRange();
    }

    previous = () => {
        const browser = this.browser.current;
        browser.scrollLeft -= browser.clientWidth;
        this.setRange();
    }

    selectSample = (index, image) => {
        const { samples, onSampleSelected } = this.props;
        this.setState({ selected: index });

        if (onSampleSelected) {
            onSampleSelected(index, samples[index], image);
        }
    }

    setRange = () => {
        const browser = this.browser.current;
        var range = [0,0];
        var width = this.unitWidth + 32;
        if (browser) {
            range[0] = Math.max(Math.ceil(browser.scrollLeft/width),1);
            range[1] = range[0] + Math.round(browser.clientWidth / width) - 1;
        }
        this.setState({
            range: range,
        })
    }

    componentDidMount() {
        this.setRange();
    }

    render() {

        const { samples, folder } = this.props;
        const num = this.state.size;
        const { range } = this.state; 

        return (
            <div
                ref={this.container}
                className="flex flex-row w-full pt-4 px-6"
            >
                <div className="flex flex-col h-full pr-6 pb-4"
                    style={{
                        width: "0px",
                        minWidth: "250px",
                    }}
                >
                    <h1 className="font-semibold font-poppins text-xl">Explore</h1>
                    <div className="flex flex-grow w-full"></div>
                    <div className="flex flex-row gap-1 place-items-center">
                        <button 
                            className="focus:outline-none"
                            disabled={range[0] === 1}
                            onClick={this.previous}
                        >
                            <svg width="24" height="24" viewBox="0 0 26 26">
                                <path d="M18.4 13.5C18.6761 13.5 18.9 13.2761 18.9 13C18.9 12.7239 18.6761 12.5 18.4 12.5V13.5ZM7.6 13L7.24645 12.6464L6.89289 13L7.24645 13.3536L7.6 13ZM11.5536 9.75356C11.7488 9.55829 11.7488 9.24171 11.5536 9.04645C11.3583 8.85119 11.0417 8.85119 10.8464 9.04645L11.5536 9.75356ZM10.8464 16.9536C11.0417 17.1488 11.3583 17.1488 11.5536 16.9536C11.7488 16.7583 11.7488 16.4417 11.5536 16.2464L10.8464 16.9536ZM18.4 12.5H7.6V13.5H18.4V12.5ZM10.8464 9.04645L7.24645 12.6464L7.95355 13.3536L11.5536 9.75356L10.8464 9.04645ZM7.24645 13.3536L10.8464 16.9536L11.5536 16.2464L7.95355 12.6464L7.24645 13.3536ZM25.5 13C25.5 6.09644 19.9036 0.500002 13 0.500002V1.5C19.3513 1.5 24.5 6.64873 24.5 13H25.5ZM13 0.500002C6.09644 0.500002 0.5 6.09644 0.5 13H1.5C1.5 6.64873 6.64873 1.5 13 1.5V0.500002ZM0.5 13C0.5 19.9036 6.09644 25.5 13 25.5V24.5C6.64873 24.5 1.5 19.3513 1.5 13H0.5ZM13 25.5C19.9036 25.5 25.5 19.9036 25.5 13H24.5C24.5 19.3513 19.3513 24.5 13 24.5V25.5Z" fill={range[0] === 1 ? "rgba(0,0,0,0.2)" : "black"}/>
                            </svg>
                        </button>
                        <p className="flex-grow font-poppins font-light text-xs w-20 text-center">{
                            range[0] + "-" + range[1] + " / " + samples.length
                        }</p>
                        <button 
                            className="focus:outline-none"
                            disabled={range[1] === samples.length-1}
                            onClick={this.next}
                        >
                            <svg width="24" height="24" viewBox="0 0 26 26">
                                <path d="M7.6 12.5C7.32386 12.5 7.1 12.7239 7.1 13C7.1 13.2761 7.32386 13.5 7.6 13.5L7.6 12.5ZM18.4 13L18.7536 13.3536L19.1071 13L18.7536 12.6464L18.4 13ZM14.4464 16.2464C14.2512 16.4417 14.2512 16.7583 14.4464 16.9536C14.6417 17.1488 14.9583 17.1488 15.1536 16.9536L14.4464 16.2464ZM15.1536 9.04645C14.9583 8.85118 14.6417 8.85118 14.4464 9.04645C14.2512 9.24171 14.2512 9.55829 14.4464 9.75355L15.1536 9.04645ZM7.6 13.5L18.4 13.5L18.4 12.5L7.6 12.5L7.6 13.5ZM15.1536 16.9536L18.7536 13.3536L18.0464 12.6464L14.4464 16.2464L15.1536 16.9536ZM18.7536 12.6464L15.1536 9.04645L14.4464 9.75355L18.0464 13.3536L18.7536 12.6464ZM0.500001 13C0.5 19.9036 6.09644 25.5 13 25.5L13 24.5C6.64872 24.5 1.5 19.3513 1.5 13L0.500001 13ZM13 25.5C19.9036 25.5 25.5 19.9036 25.5 13L24.5 13C24.5 19.3513 19.3513 24.5 13 24.5L13 25.5ZM25.5 13C25.5 6.09644 19.9036 0.500001 13 0.500001L13 1.5C19.3513 1.5 24.5 6.64873 24.5 13L25.5 13ZM13 0.500001C6.09644 0.5 0.500002 6.09644 0.500001 13L1.5 13C1.5 6.64872 6.64873 1.5 13 1.5L13 0.500001Z" fill="black"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    ref={this.browser}
                    className="flex flex-row gap-1"
                    style={{
                        width: "0px",
                        minWidth: "calc(100% - 250px)",
                        height: "260px",
                        overflowX: "auto",
                    }}
                    onScroll={this.scroll}
                    onWheel={this.scroll}
                >
                    {samples.slice(0, num).map(
                        (sample, key) => (
                            <Sample
                                key={key}
                                index={key}
                                sample={sample}
                                datapath={folder}
                                total={samples.length}
                                size={this.unitWidth}
                                selected={key === this.state.selected}
                                onSelect={this.selectSample}
                            />
                        )
                    )
                    }
                </div>
            </div>
        );

    }
}

class Sample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            thumbnail: "",
        }
    }

    componentDidMount() {

        const { sample, datapath, selected } = this.props;
        const filename = path.join(
            "file://", datapath, sample.path
        );

        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {

                this.setState({ thumbnail: event.target.result });
                if (selected) {
                    this.select();
                }

            }, false);
        };
        request.send();

    }

    select = () => {
        const { index, onSelect } = this.props;
        onSelect(index, this.state.thumbnail);
    }

    render() {

        const { sample, size, index, total, selected } = this.props;
        var id = index + 1;
        var id = ("" + id).padStart(("" + total).length, 0);

        return (
            <div
                className="flex flex-col relative justify-start font-regular px-4 py-2 uppercase font-poppins border rounded"
                style={{
                    backgroundColor: selected ? "rgb(190,210,192,0.4)" : "transparent",
                    borderColor: selected ? "rgba(8, 25, 24, 0.2)" : "transparent",
                    minWidth: size + 32 + "px",
                    maxWidth: size + 32 + "px",
                    minHeight: size + 64 + "px",
                    maxHeight: size + 64 + "px",
                }}
                onClick={this.select}
            >
                <div className="flex my-2 relative">
                    <img
                        className="object-cover rounded"
                        src={this.state.thumbnail}
                        alt=''
                        style={{
                            width: size + "px",
                            height: size + "px",
                        }}
                    />
                </div>
                <div className="flex flex-col relative">
                    <p
                        className="h-4 font-poppins align-text-bottom text-sm"
                        style={{
                            color: selected ? "rgba(42, 72, 56)" :
                                "rgba(75, 85, 99)",
                            fontWeight: selected ? 700 : 600,
                        }}
                    >
                        {
                            id.padStart(("" + total).length, 0)
                        }
                    </p>
                    <p className="truncate w-60 justify-start"
                        style={{
                            fontSize: "10px",
                            width: size - 50 + "px",
                            marginTop: "2px",
                            color: selected ? "rgba(75, 85, 99)" : "rgba(156, 163, 175)",
                        }}
                    >
                        {sample.path}
                    </p>
                    <HiOutlineDotsVertical className="w-5 h-4 my-2 absolute -right-2 hover:cursor-pointer pr-1 text-gray-400 hover:text-gray-800" />
                </div>
            </div>
        )
    }
}

export const ToolbarButton = tw.button`
    flex
    rounded-full
    w-10 h-10 my-2 mx-1
    text-gray-400
    text-sm font-medium font-inter
    align-center justify-center items-center

    hover:cursor-pointer
    hover:text-theme
    hover:font-bold
    hover:ring-opacity-50

    focus:outline-none
    focus:bg-opacity-75
`

export const BreadCrumb = tw.ol`
    flex
    items-center
    h-full
    justify-start
    space-x-2
`

export const CloseButton = tw.div`
    flex
    w-full h-full
    text-gray-400
    row-start-1 col-start-1
    justify-center
    items-center
    align-middle
    hover:text-theme
    hover:font-bold
    hover:cursor-pointer
    border-r
`

export const LabelerContainer = tw.div`
    grid
    w-full
    h-full
`

export const Cell = tw.div`
    flex
    w-full
    h-auto
`

export const ToolbarContainer = tw.div`
    grid
    items-center
    text-sm 
    text-gray-500
    font-regular
    font-system
    tracking-wide
    w-full
    h-full
    bg-white
    border-b
    border-gray-200
    border-opacity-50
`

export const LabelToolContainer = tw.div`
    flex
    w-full
    align-middle 
    justify-center 
    py-8
    border-r
`

export const LabelToolIcon = tw.div`
    flex 
    items-center
    justify-center 
    w-10
    h-10
    rounded-sm
    transition-all
    duration-100
    ring-white
    hover:ring-theme
    hover:ring-opacity-75
    hover:cursor-pointer
`

export const DatasetName = tw.a`
    mx-3
    text-sm 
    text-gray-500
    font-regular
    font-poppins
    tracking-wide
    overflow-hidden
    hover:text-theme
    hover:border-b
`

export const SampleName = tw.a`
    flex
    ml-1
    text-sm
    font-regular
    font-poppins
    font-semibold
    scale-y-125
    text-gray-800
    uppercase
`