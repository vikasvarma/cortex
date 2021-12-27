/**
 * 
 */
import React, { Component } from 'react';
import tw from 'tailwind-styled-components';
import Header from './header/Header';
import Labeler from './labeler/Labeler';
import Controlbar from './controlbar/Controlbar';
import Searchbar from './controlbar/Searchbar';
import Details from './details/Details';

const GridDiv = tw.div`
    flex
    w-full 
    h-full
`

class Home extends Component {
    state = {
        sidebar: window.innerWidth < 768,
        details: window.innerWidth > 1280,
        user: 'vikas@gmail.com',
        dataset: 'DS000002'
    }

    setPanels = () => {
        // Sidebar state: lg-large; sm-small
        this.setState({
            sidebar: window.innerWidth < 768,
            details: window.innerWidth > 1280,
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
                        grid
                        w-screen
                        h-screen
                    `}
                    style = {{
                        gridTemplateRows    : "2.5rem 1fr",
                        gridTemplateColumns : "5rem 5fr"
                    }}
                >
                    <Header trim = {true}/>
                    <div
                        className={`
                            flex
                            row-start-2
                            col-start-1
                            border-r
                            border-gray-300
                        `}
                    />
                    <GridDiv 
                        className = {`
                        row-start-2 col-start-2 
                        border-b border-t border-r
                        border-gray-300
                        border-opacity-50
                    `}>
                        <Labeler 
                            user={this.state.user}
                            dataset={this.state.dataset}
                        />
                    </GridDiv>
                </div>
            </>
        );
    }
};
 
 export default Home;