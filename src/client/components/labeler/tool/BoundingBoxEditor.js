import React, { Component } from 'react';
import {connect} from 'react-redux';

class BoundingBoxEditor extends Component {

    constructor(props){
        super(props);
        this.refs = {
            editor: React.createRef(),
            wrapper: React.createRef(),
            image: React.createRef()
        }
    }

    mouseMove(){

    }

    mouseUp(){

    }

    render() {
        return (
            <div
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className={styles.editor}
                ref={editorRef}
            >
                <span
                    onMouseDown={handleMouseDown}
                    className={styles.wrapper}
                    ref={wrapperRef}
                >
                    <img
                        className={styles.img}
                        onLoad={handleImageResize}
                        src={imgSrc}
                        ref={imgRef}
                        alt=""
                    />

                    {boxes.map(({ x0, y0, x1, y1, id }, i) =>
                        i >= timelineIdx ? null : (
                            <div
                                className={styles.box}
                                style={{
                                    height: (y1 - y0) * state.scaleRatio,
                                    width: (x1 - x0) * state.scaleRatio,
                                    left: x0 * state.scaleRatio,
                                    top: y0 * state.scaleRatio,
                                }}
                                key={`box-${id}`}
                            />
                        )
                    )}

                    {state.isEditing && (
                        <div
                            className={styles.activeBox}
                            style={{
                                height: Math.abs(state.y0 - state.y1),
                                width: Math.abs(state.x0 - state.x1),
                                left: Math.min(state.x0, state.x1),
                                top: Math.min(state.y0, state.y1),
                            }}
                        />
                    )}
                </span>
            </div>
        )
    }
}