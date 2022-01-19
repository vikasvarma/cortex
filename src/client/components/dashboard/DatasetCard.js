import React from 'react';
import tw from 'tailwind-styled-components';
import {
    AddIcon,
    FolderIcon,
    DeleteIcon,
    EditIcon,
    ExpandIcon
} from '../Icons';
import Avatars from './Avatar';

const path = window.require('path');

export class LargeDatasetCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
        }
    }

    static defaultProps = {
        data: {
            name: "",
            description: "",
            classes: [],
            samples: []
        }
    }

    componentDidMount() {
        const { samples } = this.props.data;
        const thumbs = samples.slice(0, Math.min(7, samples.length + 1));

        thumbs.forEach(element => {

            var file = path.join(
                "file://", this.props.data.path, element.path
            );

            var request = new XMLHttpRequest();
            request.open('GET', file, true);
            request.responseType = 'blob';
            request.onload = () => {
                var reader = new FileReader();
                reader.readAsDataURL(request.response);
                reader.addEventListener("load", (event) => {
                    var imgs = this.state.images.concat(event.target.result)
                    this.setState({ images: imgs });
                }, false);
            };
            request.send();

        });
    }

    render() {

        const { onOpen, onDelete, onEdit } = this.props;
        const { data } = this.props;
        const { classes } = data;

        return (
            <div 
                className="flex px-4 py-4 rounded-md bg-theme3 w-full h-full"
                onDoubleClick={()=>onEdit(data)}
            >
                <div className="grid grid-flow-row w-full"
                    style={{
                        gridTemplateColumns: "1.1fr 1fr"
                    }}
                >
                    <div className="flex flex-col w-full px-2 overflow-hidden">
                        <div className="flex w-full h-6 flex-row items-center">
                            <p
                                className="flex-grow font-semibold truncate font-poppins"
                                style={{
                                    fontSize: "20px"
                                }}
                            >
                                {data.name}
                            </p>
                            <button
                                className="flex text-xs pl-2 pr-4 h-6 font-poppins font-regular place-content-start items-center ml-4 bg-black rounded-full text-white focus:outline-none"
                            >
                                <AddIcon className="mx-2 cursor-pointer" width="10" height="10" stroke="white" />
                                Add
                            </button>
                        </div>
                        <Avatars />
                        <p
                            className="font-poppins w-4/5 font-light my-2 line-clamp-4"
                            style={{ fontSize: "12.5px", lineHeight: "18px" }}
                        >
                            {data.description}
                        </p>
                        <div className="flex flex-row my-3 space-x-4">
                            <div onClick={() => onOpen(this.props.data.path)}>
                                <FolderIcon className="cursor-pointer opacity-60 hover:opacity-100" />
                            </div>
                            <div onClick={() => onDelete(this.props.index)}>
                            <DeleteIcon className="cursor-pointer opacity-60 hover:opacity-100" />
                            </div>
                            <EditIcon className="cursor-pointer opacity-60 hover:opacity-100" />
                        </div>
                        <div className="flex flex-grow" />
                        <div className="flex flex-row h-6 place-items-center">
                            <ExpandIcon className="opacity-60 mr-4 cursor-pointer" />
                            <div className="flex flex-grow overflow-auto flex-row space-x-1 place-items-center">
                                {
                                    classes !== undefined &&
                                    classes.map((def, ind) => (
                                        <span key={ind} className="inline-block rounded-full px-4 py-1 h-6 bg-white font-poppins overflow-ellipsis whitespace-nowrap content-center justify-center overflow-hidden place-items-center" style={{ fontSize: "10px", maxWidth: "120px" }}>
                                            {def.name}
                                        </span>
                                    ))
                                }
                            </div>
                            <div></div>
                        </div>
                    </div>
                    <div className="flex w-full min-h-0">
                        <div
                            className="grid grid-flow-col grid-cols-1 grid-rows-2 ml-2"
                            style={{
                                gridTemplateRows: "1fr 1fr 1fr",
                                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                                maxHeight: "100%",
                                gap: "5px",
                            }}
                        >
                            <div className="flex rounded-sm row-span-2 col-span-2 overflow-hidden">
                                <img className="object-cover" src={this.state.images[0]} alt="" />
                            </div>
                            <div className="flex rounded-sm overflow-hidden">
                                <img className="object-cover" src={this.state.images[1]} alt="" />
                            </div>
                            <div className="flex rounded-sm col-span-2 overflow-hidden">
                                <img className="object-cover" src={this.state.images[2]} alt="" />
                            </div>
                            <div className="flex rounded-sm col-span-2 overflow-hidden">
                                <img className="object-cover" src={this.state.images[3]} alt="" />
                            </div>
                            <div className="flex rounded-sm overflow-hidden">
                                <img className="object-cover" src={this.state.images[4]} alt="" />
                            </div>
                            <div className="flex rounded-sm overflow-hidden">
                                <img className="object-cover" src={this.state.images[5]} alt="" />
                            </div>
                            <div className="flex relative rounded-sm flex-col overflow-hidden">
                                <img className="flex-grow object-cover" src={this.state.images[6]} alt="" />
                                <div className="bg-black bg-opacity-80 absolute w-full bottom-0 text-white flex place-items-center justify-center font-poppins font-regular text-xs py-1 px-2">Total: {this.props.data.samples.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export class SmallDatasetCard extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            selected: false,
            thumbnail: "",
        }
    }

    static defaultProps = {
        data: {
            name: "",
            description: "",
            classes: [],
            samples: []
        }
    }

    componentDidMount() {
        const { samples } = this.props.data;
        if (samples.length > 0) {
            var request = new XMLHttpRequest();
            var file = path.join(
                "file://", this.props.data.path, samples[0].path
            );
            request.open('GET', file, true);
            request.responseType = 'blob';
            request.onload = () => {
                var reader = new FileReader();
                reader.readAsDataURL(request.response);
                reader.addEventListener("load", (event) => {
                    this.setState({ thumbnail: event.target.result });
                }, false);
            };
            request.send();
        }
    }

    openFolder = () => {
        const { exec } = window.require('child_process');
        const cmd = "cd " + this.props.data.path + "; open .";
        exec(cmd);
    }

    render() {

        const { data, onEdit } = this.props;

        return (
            <div
                ref={this.container}
                className="flex py-3 my-2 mx-2 rounded-md border border-black border-opacity-10 hover:border-opacity-100"
                style={this.props.style}
                onDoubleClick={()=>onEdit(data)}
            >
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="flex pl-4 pr-3 w-full h-8 flex-row items-center">
                        <p
                            className="flex-grow font-medium truncate font-poppins align-top line-clamp-2"
                            style={{
                                fontSize: "16px"
                            }}
                        >
                            {data.name}
                        </p>
                        <button
                            className="flex text-xs py-2 px-2 font-poppins font-regular justify-center items-center ml-4 bg-black rounded-full text-white focus:outline-none"
                        >
                            <AddIcon className="cursor-pointer" width="10" height="10" stroke="white" />
                        </button>
                    </div>
                    <div className="flex flex-grow relative mb-2 mt-1 place-content-center px-2">
                        <svg
                            className="absolute"
                            style={{ top: "-5%" }}
                            width="230" height="230"
                            viewBox="0 0 253 235" fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M172.961 17.6977C209.529 32.0951 243.477 51.579 250.909 80.1839C258.184 108.861 238.942 146.66 209.884 178.459C180.826 210.259 142.109 235.989 109.203 234.948C76.1397 233.98 48.8255 206.108 28.8878 177.27C8.73118 148.371 -4.11038 118.372 1.97481 85.9773C7.99861 53.4488 33.168 18.5852 65.1417 5.98417C97.3342 -6.55578 136.488 3.09445 172.961 17.6977Z" fill="#BED2C0" fill-opacity="0.25" />
                        </svg>

                        <div className="flex w-4/5 my-4 relative rounded-xl overflow-hidden border border-black">
                            <img src={this.state.thumbnail} className="object-cover z-1" />
                            <p className="flex absolute bottom-0 right-0 z-2 px-2 h-8 items-center justify-center bg-white text-black text-xs font-medium font-poppins border-l border-t border-black">{data.samples.length}</p>
                        </div>
                    </div>
                    <div className="flex px-4 flex-row h-6 place-items-center items-center">
                        <div className="flex flex-grow">
                            <Avatars />
                        </div>
                        <div onClick={this.openFolder}>
                            <FolderIcon className="cursor-pointer opacity-60" />
                        </div>
                        <ExpandIcon className="opacity-60 ml-2 cursor-pointer" />
                    </div>
                </div>
            </div>
        );
    }
}