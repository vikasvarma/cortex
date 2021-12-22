export const initialState = {
    // The ratio between the actual image size and the rendered image size
    scaleRatio: 1,

    // Coordinates for top-left and bottom-right corners of the rendered image
    // Used for adjusting boxes coordinates and setting boxes bounds.
    offsetX0: 0,
    offsetY0: 0,
    offsetX1: 0,
    offsetY1: 0,

    // Coordinates of the initial point of a new box
    x0: 0,
    y0: 0,

    // Coordinates of the end point of a new box
    x1: 0,
    y1: 0,

    // ID of the box being edited
    id: null,

    // Wether we are drawing a new box or not
    isEditing: false,
}

export default function BoundingBoxReducer(state, action) {
    payload = action.payload;

    switch (action.type) {
        case 'IMAGE_RESIZED':
            return {
                ...state,
                scaleRatio: payload.scaleRatio,
                offsetX0  : payload.offsetX0,
                offsetY0  : payload.offsetY0,
                offsetX1  : payload.offsetX1,
                offsetY1  : payload.offsetY1,
            }

        case 'START_BBOX_DRAW':
            return {
                ...state,
                isEditing: true,
                id: payload.id,
                x0: payload.x - state.offsetX0,
                x1: payload.x - state.offsetX0,
                y0: payload.y - state.offsetY0,
                y1: payload.y - state.offsetY0,
            }

        case 'BBOX_DRAW_UPDATE': {
            return {
                ...state,
                /**
                 * When drawing a box, we use a combination of max and min to 
                 * "clamp" the coordinates to the image borders. Also, we 
                 * adjust by offsets. 
                 */
                x1: Math.min(
                        Math.max(payload.x, state.offsetX0), 
                        state.offsetX1
                    ) - state.offsetX0,

                y1: Math.min(
                        Math.max(payload.y, state.offsetY0), 
                        state.offsetY1
                    ) - state.offsetY0,
            }
        }

        case 'BBOX_DRAW_END': {
            return {
                ...initialState,
                scaleRatio: state.scaleRatio,
                offsetX0  : state.offsetX0,
                offsetY0  : state.offsetY0,
                offsetX1  : state.offsetX1,
                offsetY1  : state.offsetY1,
            }
        }

        default:
            return state
    }
}
