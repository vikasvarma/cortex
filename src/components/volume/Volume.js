/**
* Volume React Component
*/
import React, { Suspense } from 'react';
import { VolumeRenderShader1 } from 'three/examples/jsm/shaders/VolumeShader';
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import GrayFile from './textures/cm_gray.png';
import ViridisFile from './textures/cm_viridis.png';
import tw from 'tailwind-styled-components';
import { 
    Canvas,
    useLoader
} from '@react-three/fiber';

import { 
    BoxGeometry, 
    TextureLoader, 
    UniformsUtils,
    DataTexture3D,
    RedFormat,
    FloatType,
    LinearFilter,
    BackSide
} from 'three';

const shader = VolumeRenderShader1;
const uniforms = UniformsUtils.clone(shader.uniforms);

let config = {
    cmap : 'virdis',
    renderstyle : {
        'mip': 0,
        'iso': 1
    },
    clim : [0, 1],
    isothr : 0.15
};

function VolumeMaterial(props){

    const [x,y,z] = [
        props.volume.xLength, 
        props.volume.yLength, 
        props.volume.zLength
    ];

    // Load colormap textures:
    const [gray, virdis] = useLoader(TextureLoader, [GrayFile, ViridisFile]);
    const colormaps = { 
        gray: gray, 
        virdis: virdis 
    };

    // Create texture:
    const texture = new DataTexture3D( props.volume.data, x, y, z );
    texture.format = RedFormat;
    texture.type = FloatType;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.unpackAlignment = 1;

    uniforms[ "u_data" ].value = texture;
    uniforms[ "u_size" ].value.set( x, y, z );
    uniforms[ "u_clim" ].value.set( config.clim[0], config.clim[1] );
    uniforms[ "u_renderstyle" ].value = config.renderstyle.iso;
    uniforms[ "u_renderthreshold" ].value = config.isothr;
    uniforms[ "u_cmdata" ].value = colormaps[ config.cmap ];

    return(
        <shaderMaterial
            uniforms       = {uniforms}
            vertexShader   = {shader.vertexShader}
            fragmentShader = {shader.fragmentShader}
            side           = {BackSide}
        />
    );
}

function VolumeMesh(props){
    const volume = useLoader(props.loader, props.source);
    const [x,y,z] = volume.dimensions;
    const geometry = new BoxGeometry(x,y,z);
    geometry.translate(x/2 - 0.5, y/2 - 0.5, z/2 - 0.5);

    return(
        <>
            <OrthographicCamera 
                makeDefault
                position = {[0, 0, z/2]}
                up       = {[0,0,1]}
            />
            <OrbitControls target = {[x/2,y/2,z/2]} />
            <mesh castShadow geometry = {geometry}>
                <VolumeMaterial volume = {volume}/>
            </mesh>
        </>
    );
}

const Container = tw.div`
    flex
    w-full
    h-full
`

function Volume(props) {

    const {source, loader, ...rest} = props;

    return(
        <Container {...rest}>
            <Canvas>  
                <Suspense fallback = {null}>
                    <VolumeMesh source = {source} loader = {loader} />
                </Suspense>
            </Canvas>
        </Container>
    );
};
 
export default Volume;