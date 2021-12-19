import React, {useState} from 'react';
import Card3D from '../widgets/Card';

function MetadataDetails(){

    const [tform, settform] = useState(null);

    return(
        <>
            <div className = "p-6">
                <Card3D ß
                    className = "p-6"
                    onMouseEnter = {(event) => {
                        settform("translateZ(100px)")
                    }}
                    onMouseLeave = {(event) => {
                        settform("translateZ(0px)")
                    }}
                >
                </Card3D>
            </div>
        </>
    );
}

export default MetadataDetails;