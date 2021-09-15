/**
 * 
 */
import React, { Component } from 'react';
import tw from 'tailwind-styled-components';
import { HomeContainer } from '../styles/containers/Home';
import { SidebarContainer } from '../styles/containers/Sidebar';
import Header from './header/Header';
import Volume from './volume/Volume';
import Sidebar from './sidebar/Sidebar';
import Controlbar from './controlbar/Controlbar';
import Searchbar from './controlbar/Searchbar';
import Details from './details/Details';

import URL from './stent.nrrd';
import { NRRDLoader } from 'three/examples/jsm/loaders/NRRDLoader';

const GridDiv = tw.div`
    flex
    w-full 
    h-full
`

class Home extends Component {
    state = {
        sidebar: window.innerWidth < 768,
        details: window.innerWidth > 1280
    }

    setPanels = () => {
        // Sidebar state: lg-large; sm-small
        this.setState({
            sidebar: window.innerWidth < 768,
            details: window.innerWidth > 1280
        });
    }

    toggleSidebar = () => this.setState({
        sidebar: !this.state.sidebar
    });

    toggleDetails = () => this.setState({
        details: !this.state.details
    });

    componentDidMount() {
        this.setPanels();
        window.addEventListener('resize', this.setPanels)
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.setPanels)
    }

    render() {
        return (
            <>
                <div 
                    className = {`
                        flex
                        grid
                        w-screen
                        h-screen
                    `}
                    style = {{
                        gridTemplateRows    : "2.5rem 3rem 1fr",
                        gridTemplateColumns : 
                            this.state.sidebar ?
                                "5rem 5fr 3fr":
                                "13rem 5fr 3fr"
                    }}
                >
                    <Header trim = {this.state.sidebar}/>
                    <GridDiv className = "row-start-2 col-start-2">
                        <Searchbar />
                    </GridDiv>
                    <GridDiv className = "row-start-2 col-start-3">
                        <Controlbar detailsCallback = {this.toggleDetails}/>
                    </GridDiv>
                    <GridDiv className = "row-start-3">
                        <Sidebar collapsed = {this.state.sidebar}/>
                    </GridDiv>
                    <GridDiv 
                        className = {`
                            row-start-2 col-start-1 
                            border-b border-r
                            border-gray-300
                            border-opacity-50
                        `}
                    >
                    </GridDiv>
                    <GridDiv
                        className = {`
                            row-start-3
                            col-start-3
                            transition
                            ${
                                this.state.details ? 'flex' : 'hidden'
                            }
                        `}
                    >
                        <Details />
                    </GridDiv>
                </div>
            </>
        );
    }
};
 
 export default Home;