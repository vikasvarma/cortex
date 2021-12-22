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
    Image,
    LabelToolContainer,
    LabelToolIcon
} from './labeler.styles';

import {
    RiPenNibLine, 
    RiShapeLine, 
    RiCheckboxBlankCircleLine,
    RiBrushLine,
    RiEraserLine
} from 'react-icons/ri';
import {HiOutlineSwitchHorizontal} from 'react-icons/hi';
import {BiShapeTriangle} from 'react-icons/bi';

let iconStyle = "w-5 h-5";
const LabelerTools = [,
    {
        id: 'bounding-box',
        icon: <RiShapeLine className={iconStyle}/>,
        ref: "/bounding-box"
    },
    {
        id: 'freehand',
        icon: <RiPenNibLine className={iconStyle}/>,
        ref: "/freehand"
    },
    {
        id: 'polygon',
        icon: <BiShapeTriangle className={iconStyle}/>,
        ref: "/polygon"
    },
    {
        id: 'circle',
        icon: <RiCheckboxBlankCircleLine className={iconStyle}/>,
        ref: "/circle"
    },
    {
        id: 'paint',
        icon: <RiBrushLine className={iconStyle}/>,
        ref: "/paint"
    },
    {
        id: 'eraser',
        icon: <RiEraserLine className={iconStyle}/>,
        ref: "/eraser"
    },
    {
        id: 'swap',
        icon: <HiOutlineSwitchHorizontal className={iconStyle}/>,
        ref: "/swap"
    }
];

class Labeler extends Component {

    constructor(props) {
        super(props);
        this.imageRef = React.createRef();
        this.inputRef = React.createRef();
    }

    state = {
        dataset: 'Pnuemonia Dataset',
        sample: 'DS00001.JPG',
        id: 'SAMDS00001',
        path: 'file://' + '/Users/vikasvarma/Downloads/264348473_495872048288511_3715563504293009093_n.jpg',
        tool: 'bounding-box',
        data: "",
        image: {
            position: {x:0, y:0, scale:1},
            cursor: 'crosshair'
        }
    }

    setTool(value){
        var image_prop = this.state.image;
        image_prop.cursor = value === 'bounding-box'? 'crosshair' :'default';
        this.setState({tool: value});
        this.setState({image: image_prop});
        console.log(this.state.image)
    }

    scrollImage(event){
        let imageprop = this.state.image;
        const delta  = event.deltaY * -0.0025;

        if (imageprop.position.scale + delta > 1){
            const factor = Math.max(1, imageprop.position.scale + delta);
            const ratio = 1 - factor / imageprop.position.scale;
            imageprop.position = {
                scale: factor,
                x: imageprop.position.x + (event.clientX - imageprop.position.x) * ratio,
                y: imageprop.position.y + (event.clientY - imageprop.position.y) * ratio
            }
        } else {
            imageprop.position = {x:0, y:0, scale:1};
        }

        this.setState({ image : imageprop });
    }

    dragImage(event){

    }

    imageClicked(event){
        console.log(this.state.tool)
    }

    componentDidMount() {
        var request = new XMLHttpRequest();
        request.open('GET', this.state.path, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {
                this.setState({data: event.target.result});
            }, false);
        };
        request.send();
    }

    render() {
        return (
            <Grid
                style={{
                    gridTemplateRows: "3.5rem 1fr",
                    gridTemplateColumns: "4rem 2.5fr 1fr"
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
                                        key={this.state.id}
                                        className={`
                                            h-6
                                            flex items-center justify-start
                                            border-r-2
                                        `}
                                    >
                                        <a className={`
                                                mx-3
                                                text-sm 
                                                text-gray-500
                                                font-regular
                                                font-system
                                                tracking-wide
                                                overflow-hidden
                                                hover:text-theme
                                                hover:border-b
                                            `}
                                        >
                                            {this.state.dataset}
                                        </a>
                                    </li>
                                    <li>
                                        <a aria-current="page"
                                            className={`
                                                flex
                                                ml-1
                                                text-sm
                                                font-regular
                                                font-system
                                                font-bold
                                                text-theme
                                                tracking-wide
                                            `}
                                        >
                                            {this.state.sample}
                                        </a>
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
                                    className={({ active, checked }) =>`
                                        ${
                                            checked
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
                <Cell
                    className={`
                        flex-col
                        row-start-2 col-start-2
                        overflow-hidden
                        mx-8 my-8
                        rounded-md
                    `}
                >
                    <Image ref={this.imageRef} src={this.state.data}
                        onClick={this.imageClicked.bind(this)}
                        onWheelCapture={this.scrollImage.bind(this)}
                        onDragCapture={this.dragImage.bind(this)}
                        style={{
                            transformOrigin: "0 0",
                            transform: `
                                translate(
                                    ${this.state.image.position.x}px, 
                                    ${this.state.image.position.y}px
                                ) 
                                scale(${this.state.image.position.scale})
                            `,
                            cursor: `${this.state.image.cursor}`
                        }}
                    />
                </Cell>
            </Grid>
        );
    }
};

export default Labeler;