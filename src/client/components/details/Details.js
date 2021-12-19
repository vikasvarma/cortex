import React from 'react';
import tw from 'tailwind-styled-components';
import MetadataDetails from './MetadataDetails';

function Details({

}) {
    return(
        <div 
            className = {`
                flex
                h-full
                w-full
                bg-white
                grid
                border-l
                border-gray-300
                border-opacity-50
            `}
        >
            <MetadataDetails />
        </div>
    );
}

export default Details;