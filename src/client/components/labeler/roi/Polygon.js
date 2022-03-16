import React from 'react';

export default class Polygon extends React.Component {
    render() {

        let { position, parent, active } = this.props;

        // Convert position to image coordiantes:
        let dim = parent ? parent.getBoundingClientRect() : {
            width: 0,
            height: 0,
        };
        position = position.map(pt => {
            return [pt[0] * dim.width, pt[1] * dim.height]
        });

        // construct point string:
        let points = "";
        position.forEach(point => {
            points += `${point[0]},${point[1]} `;
        })
        points = points.trim();

        return (
            <svg 
                className="flex absolute"
                width="100%"
                height="100%"
                viewBox={[0,0,dim.width,dim.height]}
                style={this.props.style}
            >
                <polyline
                    points={points}
                    fill="none"
                    stroke="white"
                    strokeWidth={1}
                />
                {
                    active &&
                    position.map((point,ind) => (
                        <Point
                            key={ind}
                            position={point}
                        />
                    ))
                }
            </svg>
        )
    }

}

class Point extends React.Component {
    render() {
        const { position } = this.props;
        return (
            <circle
                className="absolute border bg-white border-black"
                fill="black"
                stroke="white"
                strokeWidth={1.5}
                cx={position[0]}
                cy={position[1]}
                r={3}
            />
        )
    }
}