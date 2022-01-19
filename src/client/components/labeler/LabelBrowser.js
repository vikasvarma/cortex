import React from 'react';
import Label from './Label';
import tw from 'tailwind-styled-components';
import { FiLayers } from 'react-icons/fi';
import { HiOutlineSortDescending } from 'react-icons/hi';

const Container = tw.div`
    flex
    flex-col
    w-full
    h-full
    border-l
    overflow-hidden
    border-gray-200
`

const Knob = tw.div`
    absolute
    border-2
    bg-gray-600
    border-white
    w-2
    h-2
    duration-100
    transition-opacity
`

const SortIcon = () => {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.6 4.2H11.4M6.6 1H13M6.6 7.4H9.8M5.8 10.6L3.4 13L1 10.6M3.4 1V12.2" stroke="black" stroke-width="0.75" stroke-linecap="round" />
        </svg>
    );
}

const BackgroundBlob = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 363 317"
            className="px-6 pb-2"
            fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M278.037 104.92C314.687 146.778 361.737 184.426 362.975 224.302C364.213 264.427 319.639 307.028 275.065 315.449C230.492 323.622 185.67 297.864 136.144 276.315C86.6176 254.767 31.891 237.429 10.5947 197.305C-10.7017 157.181 1.18466 94.2699 36.596 52.6596C72.0074 11.0492 130.696 -9.01299 173.041 3.86642C215.386 16.9935 241.635 63.0621 278.037 104.92Z" fill="#BED2C0" fill-opacity="0.25" />
        </svg>
    );
}

function Preview(props) {

    var { label, image } = props;
    var position = label.position;
    const dim = 210;

    // Calculate a N-by-N region around the bounding box to 
    // display as the label thumbnail.
    if (position.constructor == String) {
        position = position.slice(1, position.length - 1);
        position = position.split(' ').map((x) => {
            return Number(x.trim())
        });
    }

    // Get image width and height
    var img = new Image();
    img.src = image;
    var imgw = img.naturalWidth;
    var imgh = img.naturalHeight;

    const x0 = position[0];
    const x1 = position[1];
    const y0 = position[2];
    const y1 = position[3];

    const left = x0 > x1 ? Math.round(x1 * imgw) : Math.round(x0 * imgw);
    const top = y0 > y1 ? Math.round(y1 * imgh) : Math.round(y0 * imgh);
    const boxw = Math.abs(Math.round((x1 - x0) * imgw));
    const boxh = Math.abs(Math.round((y1 - y0) * imgh));
    const center = [left + boxw / 2, top + boxh / 2];
    const sqbox = Math.max(boxw, boxh) + 40;

    // Account for regions going out of bounds when snapped:
    center[0] = center[0] + Math.min(0, imgw - center[0] - sqbox / 2);
    center[1] = center[1] + Math.min(0, imgh - center[1] - sqbox / 2);

    var scale = dim / sqbox;
    var bgw = Math.round(imgw * scale);
    var bgh = Math.round(imgh * scale);
    var bgx = Math.max(0,(center[0] - sqbox / 2) * scale);
    var bgy = Math.max(0,(center[1] - sqbox / 2) * scale);

    // find the corresponding bounding box coordinates:
    var boxleft = left * scale - bgx;
    var boxtop = top * scale - bgy;
    var boxwidth = boxw * scale;
    var boxheight = boxh * scale;

    const neknob = {top:'-4px',right:'-4px'};
    const seknob = {bottom:'-4px',right:'-4px'};
    const swknob = {bottom:'-4px',left:'-4px'};
    const nwknob = {top:'-4px',left:'-4px'};

    return (
        <div
            className="absolute rounded-xl border border-black overflow-hidden"
            style={{
                backgroundImage: 'url(' + image + ')',
                backgroundSize: bgw + "px " + bgh + "px",
                backgroundRepeat: "no-repeat",
                backgroundPositionX: -bgx + "px",
                backgroundPositionY: -bgy + "px",
                width: dim + "px",
                height: dim + "px",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
            }}
        >
            <div 
                className="border-2 border-white absolute"
                style={{
                    width: boxwidth + "px",
                    height: boxheight + "px",
                    top: boxtop + "px",
                    left: boxleft + "px",
                    boxShadow: "0 0 0 2000px rgba(0,0,0,0.5)",
                }}
            >
                <Knob style = {neknob}/>
                <Knob style = {seknob}/>
                <Knob style = {swknob}/>
                <Knob style = {nwknob}/>
            </div>
        </div>
    );
}

export default class LabelBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
        this.state = {
            selected: 0,
            height: 0,
        }
    }

    onSelected(key){
        this.setState({selected: key});
    }

    resize = () => {
        const parent = this.container.current;
        if (parent != undefined) {
            const position = parent.getBoundingClientRect();
            this.setState({ height: Math.max(0, position.height - 353.66) })
        }
    }

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize)
    }

    render() {

        const { labels, image, classes } = this.props;

        return (
            <Container ref={this.container}>
                <div className="flex w-full place-items-center px-4 py-4">
                    <p className="flex flex-grow text-xl pl-2 font-poppins font-semibold">Labels</p>
                    <button
                        className="flex flex-row text-black font-poppins px-2 place-items-center border-b border-black focus:outline-none items-center align-middle"
                        style={{
                            fontSize: "12px",
                            height: "26px",
                        }}
                    >
                        <p className="pr-2">Date</p>
                        <HiOutlineSortDescending className="my-1"
                            style={{
                                width: "12px",
                                height: "12px",
                            }}
                        />
                    </button>
                </div>
                <div className="flex w-full relative">
                    <BackgroundBlob className="absolute" />
                    {
                        labels[this.state.selected] != undefined &&
                        <Preview label={labels[this.state.selected]} 
                                 image={image} />
                    }
                </div>

                <div className="flex w-full place-content-center pb-4 border-b border-gray-200">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L7 7L13 1" stroke="black" stroke-linecap="round" />
                    </svg>
                </div>
                {Object.keys(labels).length > 0 &&
                    <div
                        style={{
                            flex: "1 1 auto",
                            overflowY: "auto",
                            height: "0px",
                        }}
                    >
                        {labels.map(
                            (label, idx) => (
                                <div className="flex">
                                    <Label
                                        key={idx}
                                        labelid={idx}
                                        label={label}
                                        category={classes[label.classid]}
                                        image={image}
                                        selected={this.state.selected == idx}
                                        onSelected={this.onSelected.bind(this)}
                                    />
                                </div>
                            )
                        )}
                    </div>
                }
            </Container>
        );
    }
}
