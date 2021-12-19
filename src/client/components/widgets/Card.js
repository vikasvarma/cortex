import React, { useEffect, useRef } from 'react';
import tw from 'tailwind-styled-components';
import VanillaTilt from 'vanilla-tilt';

const Container = tw.div`
    bg-card
    bg-opacity-75
    w-full
    h-1/2
    shadow-inner
    rounded-lg
    items-center
    justify-center
`

function Card3D(props) {
    let { options, ...rest } = props;
    const tilt = useRef(null);
    
    if (!options){
        options = {
            scale: 1.05,
            speed: 1000,
            max: 10
        }
    }

    useEffect(() => {
        VanillaTilt.init(tilt.current, options);
    }, [options]);
  
    return <Container 
                ref={tilt} 
                style = {{
                    transformStyle: "preserve-3d"
                }}
                {...rest} 
            />;
}

export default Card3D;