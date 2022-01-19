import React from 'react';
import tw from 'tailwind-styled-components';

const Icon = tw.div`
    flex 
    pl-2 pr-1 
    h-4
    place-content-end
    cursor-pointer
    opacity-50
    hover:opacity-100
`

const EditButton = () => {
    return (
        <svg width="14" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 7C21 7 18 13 11 13C4 13 1 7 1 7C1 7 4 1 11 1C18 1 21 7 21 7Z" stroke="black" stroke-width="1.2" stroke-linecap="round" />
            <path d="M14 7C14 8.65685 12.6569 10 11 10C9.34315 10 8 8.65685 8 7C8 5.34315 9.34315 4 11 4C12.6569 4 14 5.34315 14 7Z" stroke="black" stroke-width="1.2" stroke-linecap="round" />
        </svg>

    );
}

const LockButton = () => {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 11H5C3.89543 11 3 11.8954 3 13V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13C21 11.8954 20.1046 11 19 11Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7 11V7C6.99875 5.76005 7.45828 4.56387 8.28937 3.64367C9.12047 2.72347 10.2638 2.1449 11.4975 2.02029C12.7312 1.89568 13.9671 2.2339 14.9655 2.96931C15.9638 3.70472 16.6533 4.78485 16.9 6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

const DeleteButton = () => {
    return (
        <svg width="10" height="12" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5H3M3 5H19M3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V5H3ZM6 5V3C6 2.46957 6.21071 1.96086 6.58579 1.58579C6.96086 1.21071 7.46957 1 8 1H12C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );
}

export default class Label extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    clicked(){
        const {onSelected} = this.props;
        if (onSelected != undefined){
            onSelected(this.props.labelid);
        }
    }

    render() {

        var { label, type, category, position, image, selected } = this.props;
        const dim = 36;

        // Calculate a N-by-N region around the bounding box to 
        // display as the label thumbnail.
        var { position } = this.props.label;
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
        const sqbox = Math.max(boxw, boxh);

        // Account for regions going out of bounds when snapped:
        center[0] = center[0] + Math.min(0, imgw - center[0] - sqbox / 2);
        center[1] = center[1] + Math.min(0, imgh - center[1] - sqbox / 2);

        var scale = dim / sqbox;
        var bgw = Math.round(imgw * scale);
        var bgh = Math.round(imgh * scale);
        var bgx = (center[0] - sqbox / 2) * scale;
        var bgy = (center[1] - sqbox / 2) * scale;

        return (
            <div
                className="flex w-full flex-row px-4 py-3 place-items-center hover:pointer bg-opacity-50"
                style={{
                    backgroundColor: selected ? "rgb(190,210,192,0.4)" : "transparent",
                    cursor: "pointer",
                }}
                onClick={this.clicked.bind(this)}
            >
                <div
                    className="flex rounded-sm bg-black"
                    style={{
                        backgroundImage: 'url(' + this.props.image + ')',
                        backgroundSize: bgw + "px " + bgh + "px",
                        backgroundRepeat: "no-repeat",
                        backgroundPositionX: -bgx + "px",
                        backgroundPositionY: -bgy + "px",
                        width: dim + "px",
                        height: dim + "px",
                        cursor: "pointer",
                    }}
                />
                <div className="flex flex-grow flex-col place-content-center pl-3">
                    <p
                        className="font-poppins text-sm flex flex-grow capitalize h-5 align-bottom scale-110 items-center"
                        style={{
                            transform: "translate(0px,1.5px)",
                            cursor: "pointer",
                        }}
                    >
                        {category !== undefined ? category.name : "unknown"}
                    </p>
                    <p className="items-start font-poppins flex flex-grow text-xs h-4 text-gray-400"
                        style={{
                            fontSize: "10px",
                            transform: "translate(0px,-1.5px)",
                            cursor: "pointer",
                        }}
                    >
                        Box
                    </p>
                </div>
                <div id='controlbar' className="flex-row place-items-center"
                    style={{
                        display: selected ? "flex": "none",
                        strokeWidth: "1.5px",
                        cursor: "pointer",
                    }}
                >
                    <Icon><EditButton /></Icon>
                    <Icon><LockButton /></Icon>
                    <Icon><DeleteButton /></Icon>
                </div>
            </div>
        );
    }
}