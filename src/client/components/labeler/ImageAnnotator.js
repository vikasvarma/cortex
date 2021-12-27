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
            imgsize: {},
            cursor: 'default',
            mode: this.props.mode,
            cursor: 'crosshair',
            isdrawing: false,
            box: BoxState,
        };

        // Create references:
        this.canvas = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize.bind(this))
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

    dragImage(evd) {} // TODO 

    resize(evd) {} // TODO

    setImageSize(){
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (this.canvas.current != undefined){
                    this.setState({
                        imgsize: this.canvas.current.getBoundingClientRect()
                    })
                }
            })
        })
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
            var W  = Math.abs(Math.round((box[1] - box[0]) * imgpos.width));
            var H = Math.abs(Math.round((box[3] - box[2]) * imgpos.height));
            
            if (W > 0 && H > 0){
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

        const labels = this.props.labels;

        return (
            <div
                onMouseDown={this.startDrawing.bind(this)}
                onMouseMove={this.updateDrawing.bind(this)}
                onMouseUp={this.finishDrawing.bind(this)}
                onWheelCapture={this.scrollImage.bind(this)}
                style={{
                    transform: `
                        scale(${this.state.zoom})
                    `,
                }}
            >
                <IMAGE
                    ref={this.canvas}
                    src={this.props.source}
                    onLoad={this.setImageSize.bind(this)}
                    onDragCapture={this.dragImage.bind(this)}
                    style={{
                        cursor: 'crosshair',
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
        )
    }
}

export default ImageAnnotator;