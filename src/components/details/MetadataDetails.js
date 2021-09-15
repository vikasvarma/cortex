import React, {useState} from 'react';
import Card3D from '../widgets/Card';

import URL from '../stent.nrrd';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';
import Wireframe from '../volume/Wireframe';

function MetadataDetails(){

    const [tform, settform] = useState(null);

    return(
        <>
            <div className = "p-6">
                <Card3D 
                    className = "p-6"
                    onMouseEnter = {(event) => {
                        settform("translateZ(100px)")
                    }}
                    onMouseLeave = {(event) => {
                        settform("translateZ(0px)")
                    }}
                >
                    <Wireframe 
                        source = {URL} 
                        loader = {NRRDLoader} 
                        className = "transition ease-in-out duration-1000"
                        style = {{
                            transform: tform
                        }}
                    />
                </Card3D>
            </div>
        </>
    );
}

export default MetadataDetails;