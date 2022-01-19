import React, { Component, useReducer } from 'react';
import { IMAGE } from './imageannotator.styles';
import { Box, BoxReducer, BoxState } from './roi/Box';

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
            cursor: 'default',
            mode: this.props.mode,
            cursor: 'crosshair',
            isdrawing: false,
            box: BoxState,
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

    dragImage(evd) { } // TODO 

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
     * Annotation drawing callbacks
     * @returns 
     */
    startDrawing(evd) {
        const limits = this.canvas.current.getBoundingClientRect();
        const originx = Math.round(evd.clientX - limits.x) / limits.width;
        const originy = Math.round(evd.clientY - limits.y) / limits.height;

        const info = {
            x: Math.min(1, Math.max(0, originx)),
            y: Math.min(1, Math.max(0, originy))
        }

        const { onDrawStart } = this.props

        // start drag if it was a left click.
        if (evd.button !== 0) return
        if (onDrawStart !== undefined) onDrawStart(info);

        this.setState({ isdrawing: true });
        this.dispatch({ type: 'START', payload: info });
    }

    updateDrawing(evd) {
        const { onDrawUpdate } = this.props;
        const { isdrawing } = this.state;
        if (!isdrawing) return

        const limits = this.canvas.current.getBoundingClientRect();
        const originx = Math.round(evd.clientX - limits.x) / limits.width;
        const originy = Math.round(evd.clientY - limits.y) / limits.height;

        const info = {
            x: Math.min(1, Math.max(0, originx)),
            y: Math.min(1, Math.max(0, originy))
        }

        if (onDrawUpdate !== undefined) onDrawUpdate(info);
        this.dispatch({ type: 'UPDATE', payload: info });
    }

    finishDrawing(evd) {
        const { onDrawFinish } = this.props;
        const { isdrawing } = this.state;
        if (!isdrawing) return

        const limits = this.canvas.current.getBoundingClientRect();
        const originx = Math.round(evd.clientX - limits.x) / limits.width;
        const originy = Math.round(evd.clientY - limits.y) / limits.height;

        const info = {
            x: Math.min(1, Math.max(0, originx)),
            y: Math.min(1, Math.max(0, originy))
        }

        this.setState({ isdrawing: false });
        this.dispatch({ type: 'END', payload: info });

        if (onDrawFinish !== undefined) {
            const box = this.state.box.position;
            const imgpos = this.canvas.current.getBoundingClientRect();
            var W = Math.abs(Math.round((box[1] - box[0]) * imgpos.width));
            var H = Math.abs(Math.round((box[3] - box[2]) * imgpos.height));

            if (W > 0 && H > 0) {
                onDrawFinish(this.state.box);
            }
        }
    }

    dispatch(action) {
        this.setState({
            box: BoxReducer(this.state.box, action)
        })
    }

    /**
     * Main render function
     * @returns Image Annotation Canvas
     */
    render() {

        const { labels } = this.props;

        return (
            <div className="flex relative rounded overflow-hidden w-full h-full" ref={this.container}>
                <div
                    ref={this.axes}
                    onMouseDown={this.startDrawing.bind(this)}
                    onMouseMove={this.updateDrawing.bind(this)}
                    onMouseUp={this.finishDrawing.bind(this)}
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
                        onDragCapture={this.dragImage.bind(this)}
                        style={{
                            height: "100%",
                            width: "100%",
                            cursor: 'crosshair',
                            position: 'absolute',
                        }}
                    />
                    {
                        this.state.isdrawing &&
                        <Box
                            position={this.state.box.position}
                            scale={this.state.zoom}
                            container={this.canvas.current}
                            redraw={true}
                        />
                    }
                    {labels.map((label) => (
                        <Box
                            key={label.id}
                            redraw={false}
                            position={label.position}
                            scale={this.state.zoom}
                            container={this.canvas.current}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

export default ImageAnnotator;