/**
 * 
 */

// Package imports: 
import React from 'react';
import tw from 'tailwind-styled-components';

// Component imports:
import WindowControls from './WindowControls';
import Tabs from './Tabs';

const HeaderContainer = tw.div`
    flex 
    items-centre
    absolute 
    w-full
    bg-gray-100
    z-10
    border-b
    border-gray-300

    -webkit-user-select: none;
    -webkit-app-region: drag;
`

function Header({trim}) {
        return(
            <>
                <HeaderContainer>
                    <WindowControls trim = {trim}/>
                    <Tabs />
                </HeaderContainer>
            </>
        );
};

export default Header;