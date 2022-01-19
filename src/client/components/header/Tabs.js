import React from 'react';
import tw from 'tailwind-styled-components';
import { IconContext } from 'react-icons';
import { RiHome6Line } from 'react-icons/ri';
import axios from "axios";

const Home = tw.button`
    flex
    w-16
    h-10
    bg-theme5
    bg-opacity-50
    text-black
    place-content-center
    place-items-center
    cursor-default
    border-opacity-0
    focus:outline-none
`

class Tabs extends React.Component {

    async handleClick(){
        const data = await axios.get('http://localhost:5000/user?userid=vikas@gmail.com')
        console.log(data)
    }

    render(){
        return(
            <div>
                <Home onClick={this.handleClick}>
                    <IconContext.Provider value = {{size: '1.3rem'}}>
                        <RiHome6Line />
                    </IconContext.Provider>
                </Home>
            </div>
        );
    }
};

export default Tabs;