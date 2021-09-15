/**
 * 
 */
import React, {useState} from 'react';
import tw from 'tailwind-styled-components';

import { IoClose, IoRemove } from 'react-icons/io5'
import { BsPlus } from 'react-icons/bs';

// Electron imports:
const electron = window.require('electron');
const remote = electron.remote

/**
 * 
 */
const Control = tw.button`
    rounded-full
    h-12px
    w-12px
    bg-opacity-100
    mx-1
    my-1

    focus:outline-none
    focus:bg-opacity-80
`

const Container = tw.div`
    px-2
    my-2  
`

/**
 * 
 */
class WindowControls extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
            hover : false
        };
    }

    /**
     * toggle - Toggles the state of the window controls component.
     */
    toggle(){
        this.setState({
            hover: !this.state.hover
        });
    }

    /**
     * close - Closes the current window.
     */
    close() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.close();
    }

    /**
     * minimize - Minimizes the current window.
     */
    minimize() {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.minimize();
    }

    /**
     * maximize - Maximize or restore the current window dimensions.
     */
    maximize() {
        const currentWindow = remote.getCurrentWindow();
        if (!currentWindow.isMaximized()) {
            currentWindow.maximize();
        } else {
            currentWindow.unmaximize();
        }
    }

    render(){

        let trim = this.props.trim;
        let closeColor, minimizeColor, maximizeColor, iconStyle;
        
        if (this.state.hover){
            closeColor    = "bg-red-600";
            minimizeColor = "bg-yellow-400";
            maximizeColor = "bg-green-600";
            iconStyle     = "h-3 w-3 opacity-50";

        } else {
            closeColor    = "bg-gray-300";
            minimizeColor = "bg-gray-300";
            maximizeColor = "bg-gray-300";
            iconStyle     = "h-3 w-3 opacity-0";
        }

        return(
            <Container id = "window-controls" 
                 onMouseEnter = {this.toggle.bind(this)}
                 onMouseLeave = {this.toggle.bind(this)}
                 className = {
                     trim ? "w-20" : "w-52"
                 }>
                <Control className = {closeColor}
                         onClick = {this.close}
                         id = "window-close">
                    <IoClose className = {iconStyle}/>
                </Control>
                <Control className = {minimizeColor} 
                         onClick = {this.minimize}
                         id = "window-minimize">
                    <IoRemove className = {iconStyle}/>
                </Control>
                <Control className = {maximizeColor} 
                         onClick = {this.maximize}
                         id = "window-maximize">
                    <BsPlus className = {iconStyle}/>
                </Control>
            </Container>
        );
    }
};

export default WindowControls