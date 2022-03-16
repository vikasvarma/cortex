import React, { Component, useReducer } from 'react';
import { Box } from './roi/Box';
import ROI from './ROI';
import Polygon from './roi/Polygon';

class ImageAnnotator extends Component {

    /**
     * Image Canvas setup with annotation tools.
     * @param {*} props 
     */
    constructor(props) {
        super(props);

        // Set initial state:
        this.state = {
            size: { w: 0, h: 0 },
            zoom: 1,
            cursor: 'crosshair',
            isdrawing: false,
        };

        // Create references:
        this.canvas = React.createRef();
        this.axes = React.createRef();
        this.container = React.createRef();
    }

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.source != this.props.source) {
            this.resize();
        }
    }

    /**
     * Image viewport adjustment routines.
     * @param {*} evd - Event data
     */
    scrollImage(evd) {
        if (this.state.isdrawing) return
        const delta = evd.deltaY * -0.01;
        this.setState({
            zoom: (this.state.zoom + delta > 1) ?
                Math.max(1, this.state.zoom + delta) :
                1
        });
    }

    resize = () => {
        /**
         * Position the container in the parent based on the image size and 
         * height.
         */

        const { source } = this.props;
        const parent = this.container.current;

        if (parent != undefined) {
            const position = parent.getBoundingClientRect();
            var img = new Image();
            img.src = source;

            // Compute container and image dimensions:
            var w_parent = position.width;
            var h_parent = position.height;
            var w_image = img.naturalWidth;
            var h_image = img.naturalHeight;
            var scale = Math.min(
                h_parent / h_image,
                w_parent / w_image
            );

            this.setState({
                size: {
                    w: w_image * scale,
                    h: h_image * scale,
                }
            })
        }
    }

    /**
     * Main render function
     * @returns Image Annotation Canvas
     */
    render() {

        const { labels, mode } = this.props;
        const { zoom } = this.state;

        return (
            <div className="flex relative rounded overflow-hidden w-full h-full" ref={this.container}>
                <div
                    ref={this.axes}
                    onWheelCapture={this.scrollImage.bind(this)}
                    style={{
                        ...this.props.style,
                        width: this.state.size.w + "px",
                        height: this.state.size.h + "px",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `
                            translate(-50%,-50%) 
                            scale(${this.state.zoom})
                        `,
                    }}
                >
                    <img
                        className="rounded"
                        ref={this.canvas}
                        src={this.props.source}
                        style={{
                            height: "100%",
                            width: "100%",
                            cursor: 'crosshair',
                            position: 'absolute',
                        }}
                    />
                    {
                        this.canvas.current !== undefined &&
                        <ROI
                            mode="polygon"
                            scale={zoom}
                            parent={this.axes.current}
                        />
                    }
                    {
                        false &&
                        labels.map((label) => (
                            <Box
                                key={label.id}
                                redraw={false}
                                position={label.position}
                                scale={this.state.zoom}
                                container={this.canvas.current}
                            />
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default ImageAnnotator;