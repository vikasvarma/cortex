import React, { Component } from 'react';
import {Img} from './image.styles';

class Image extends Component {

    constructor(props) {
        super(props);
    }

    state = {
        position  : {x:0,y:0,scale:1},
        cursor    : 'default',
        labelMode : this.props.labelMode,
        rois      : null
    }

    scrollImage(evd){
        let pos = this.state.position;
        const delta  = evd.deltaY * -0.0025;

        if (pos.scale + delta > 1){
            const factor = Math.max(1, pos.scale + delta);
            const ratio = 1 - factor / pos.scale;
            pos = {
                scale: factor,
                x: pos.x + (evd.clientX - pos.x) * ratio,
                y: pos.y + (evd.clientY - pos.y) * ratio
            }
        } else {
            pos = {x:0, y:0, scale:1};
        }

        this.setState({ position : pos });
    }

    dragImage(evd){
        // TODO
    }

    imageClicked(evd){
        // TODO
        console.log(this.state.labelMode)
    }

    render() {

        const reference = this.props.reference;
        const labelMode = this.props.labelMode;

        return (
            <div>
                <Image ref={reference} src=''
                    onClick={this.imageClicked.bind(this)}
                    onWheelCapture={this.scrollImage.bind(this)}
                    onDragCapture={this.dragImage.bind(this)}
                    style={{
                        transformOrigin: "0 0",
                        transform: `
                                translate(
                                    ${this.state.position.x}px, 
                                    ${this.state.position.y}px
                                ) 
                                scale(${this.state.position.scale})
                            `,
                        cursor: `${this.state.cursor}`
                    }}
                />
                {
                    // TODO - Add label ROIs here.
                }
            </div>
        )

    }
}

export default Image;