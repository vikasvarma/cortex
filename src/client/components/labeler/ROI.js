import React from 'react';
import { Box } from './roi/Box';
import Polygon from './roi/Polygon';

export default class ROI extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mode: "none",
            position: [],
            drawing: false,
        }
    }

    normalize = (evd) => {
        const { parent } = this.props;
        const limits = parent.getBoundingClientRect();
        const originx = Math.round(evd.clientX - limits.x) / limits.width;
        const originy = Math.round(evd.clientY - limits.y) / limits.height;

        return [
            Math.min(1, Math.max(0, originx)),
            Math.min(1, Math.max(0, originy))
        ]
    }

    _mousedown = (evd) => {
        const { mode, parent } = this.props;
        let { position } = this.state;
        if (
            parent !== undefined &&
            evd.path.includes(parent) &&
            mode !== "none"
        ) {
            let point = this.normalize(evd);
            switch (mode) {
                case "polygon":
                    if (
                        position.length > 0 &&
                        Math.abs(position[0][0] - point[0]) < 1e-2 && 
                        Math.abs(position[0][1] - point[1]) < 1e-2 &&
                        this.state.drawing
                    ) {
                        this._close(evd);

                    } else {
                        position.push(point);
                        position.push(point);
                        this.setState({ 
                            ...this.state,
                            position: position,
                            drawing: true,
                        })
                    }

                case "box":
                // TODO
            }
        }

        // Start listening to mouse movements:
    }

    _mousemove = (evd) => {
        const { mode, parent } = this.props;
        let { position } = this.state;
        if (
            parent !== undefined &&
            evd.path.includes(parent) &&
            mode !== "none" && 
            this.state.drawing
        ) {
            let point = this.normalize(evd);
            switch (mode) {
                case "polygon":
                    const n = position.length;
                    if (n > 0) {
                        position[n - 1] = point;
                        this.setState({ position: position })
                    }

                case "box":
                // TODO
            }
        }
    }

    _mouseup = (evd) => {
        const { mode, parent } = this.props;
    }

    _close = (evd) => {
        const { mode, parent } = this.props;
        let { position } = this.state;
        if (
            parent !== undefined &&
            evd.path.includes(parent) &&
            mode !== "none"
        ) {
            switch (mode) {
                case "polygon":
                    position.push(position[0]);
                    this.setState({
                        ...this.state,
                        position: position,
                        drawing: false,
                    })

                case "box":
                // TODO
            }
        }
    }

    componentDidMount() {
        window.addEventListener("mousedown", this._mousedown);
        window.addEventListener("mousemove", this._mousemove);
    }

    componentWillUnmount() {
        window.removeEventListener("mousedown", this._mousedown);
        window.removeEventListener("mousemove", this._mousemove);
    }

    render() {

        const { mode, parent } = this.props;

        return (
            <>
                {
                    mode === "box" &&
                    <Box
                        parent={parent}
                        position={this.state.position}
                        style={{
                            cursor: "crosshair",
                        }}
                    />
                }
                {
                    mode === "polygon" &&
                    <Polygon
                        parent={parent}
                        active={this.state.drawing}
                        position={this.state.position}
                        style={{
                            cursor: "crosshair",
                        }}
                    />
                }
            </>
        )
    }

}