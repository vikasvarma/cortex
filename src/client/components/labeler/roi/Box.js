import React, { Component } from 'react';
import tw from 'tailwind-styled-components';

export const BoxState = {
    position: [0,0,0,0],
    dims: [0,0],
    color: "white",
    labeldef: "tumor",
    type: "box",
    drawing: false,
}

export function BoxReducer(state, action) {
    const payload = action.payload;
    const type = action.type;
    var pos;

    switch (type) {
        case 'START':
            pos = [payload.x, payload.x, payload.y, payload.y];
            return {
                ...state,
                position: pos,
            }

        case 'UPDATE':
        case 'END':
            {
                pos = state.position;
                pos[1] = payload.x;
                pos[3] = payload.y;
                return {
                    ...state,
                    position: pos,
                }
            }

        default:
            return state
    }
}

const BoxContainer = tw.div`
    absolute
    border-2
    cursor-crosshair
`

const Knob = tw.div`
    absolute
    border-1
    bg-gray-100
    border-gray-900
    w-1.5
    h-1.5
    duration-100
    transition-opacity
`

export class Box extends Component {

    constructor(props){
        super(props);

        this.container = React.createRef();

        this.state = {
            style: {
                left: 0,
                top: 0,
                width: 0,
                height: 0,
                display: 'none',
            },
            selected: false,
            fixed: false, // Once draw ROI is fixed unless manually resized
        }
    }

    select = () => { this.setState({selected: true}) };

    deselect = (evd) => { this.setState({selected: false}) };

    updateDimensions(){
        var { position, container, scale } = this.props;

        if (container == null) return
        const imgpos = container.getBoundingClientRect()

        if (position.constructor == String){
            position = position.slice(1,position.length-1);
            position = position.split(' ').map((x) => {
                return Number(x.trim())
            });
        }

        const x0 = position[0];
        const x1 = position[1];
        const y0 = position[2];
        const y1 = position[3];
        
        const orgx = x0 > x1 ? Math.round(x1 * imgpos.width / scale) : 
                               Math.round(x0 * imgpos.width / scale);
        const orgy = y0 > y1 ? Math.round(y1 * imgpos.height / scale) : 
                               Math.round(y0 * imgpos.height / scale);
        const boxw = Math.abs(Math.round((x1 - x0) * imgpos.width / scale));
        const boxh = Math.abs(Math.round((y1 - y0) * imgpos.height / scale));

        if (imgpos.width > 0 && imgpos.height > 0) {
            this.state = {
                style: {
                    left: orgx,
                    top: orgy,
                    width: boxw,
                    height: boxh,
                    display: (boxw == 0 || boxh == 0) ? 'none' : 'initial',
                },
                dims: [boxw,boxh],
                selected: false,
                fixed: true,
            }
        }
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.updateDimensions.bind(this)
            this.setState({selected: true}) // to force re-render
        })
    }

    render() {

        if (!this.state.fixed || this.props.redraw) {
            this.updateDimensions()
        }
        
        const neknob = {top:'-3px',right:'-3px',cursor:'nesw-resize'};
        const seknob = {bottom:'-3px',right:'-3px',cursor:'nwse-resize'};
        const swknob = {bottom:'-3px',left:'-3px',cursor:'nesw-resize'};
        const nwknob = {top:'-3px',left:'-3px',cursor:'nwse-resize'};

        return (
            <BoxContainer 
                ref={this.container}
                style={this.state.style} 
                className={'border-white'}
                onMouseOver={this.select.bind(this)}
                onMouseOut={this.deselect.bind(this)}
            >
                { this.state.selected && <Knob style = {neknob}/> }
                { this.state.selected && <Knob style = {seknob}/> }
                { this.state.selected && <Knob style = {swknob}/> }
                { this.state.selected && <Knob style = {nwknob}/> }
            </BoxContainer>
        )
    }
}