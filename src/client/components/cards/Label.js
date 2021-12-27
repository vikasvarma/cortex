import React from 'react';


export default class Label extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        var { position } = this.props.label;
        if (position.constructor == String) {
            position = position.replace(/\s+/g, '');
            position = position.slice(1, position.length - 1);
            position = position.split(',').map((x) => {
                return Number(x.trim())
            });
        }

        const x0 = position[0];
        const x1 = position[1];
        const y0 = position[2];
        const y1 = position[3];

        const orgx = x0 > x1 ? Math.round(x1 * 50) : Math.round(x0 * 50);
        const orgy = y0 > y1 ? Math.round(y1 * 50) : Math.round(y0 * 50);
        const boxw = Math.abs(Math.round((x1 - x0) * 50));
        const boxh = Math.abs(Math.round((y1 - y0) * 50));
        const crop = { x: orgx, y: orgy, width: boxw, height: boxh };

        const ctx = this.canvas.current.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
        
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';


        var imgobj = new Image();
        imgobj.src = this.props.image;
        imgobj.onload = function () {
            ctx.drawImage(
                    imgobj,
                    crop.x,
                    crop.y,
                    crop.width,
                    crop.height,
                    0,
                    0,
                    crop.width,
                    crop.height
                );
            };
        }

        render() {

            var { labeldef } = this.props.label;

            return (
                <canvas ref={this.canvas} width={50} height={50} />
            );
        }
    }