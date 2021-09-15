import React from 'react';
import tw from 'tailwind-styled-components';
import { IconContext } from 'react-icons';
import { RiHome6Line } from 'react-icons/ri';

const Home = tw.button`
    flex
    w-10
    h-10
    bg-theme
    bg-opacity-50
    text-white
    place-content-center
    place-items-center
    cursor-default
    border-opacity-0
    focus:outline-none
`

class Tabs extends React.Component {

    render(){
        return(
            <div>
                <Home>
                    <IconContext.Provider value = {{size: '1.3rem'}}>
                        <RiHome6Line />
                    </IconContext.Provider>
                </Home>
            </div>
        );
    }
};

export default Tabs;