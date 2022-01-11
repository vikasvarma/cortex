/**
 * 
 */
import React, { Component } from 'react';
import tw from 'tailwind-styled-components';
import Header from './header/Header';
import Labeler from './labeler/Labeler';
import Dashboard from './dashboard/Dashboard';
import Searchbar from './controlbar/Searchbar';
import ServerDispatcher from '../Dispatcher';

const controller = new ServerDispatcher();

const GridDiv = tw.div`
    flex
`

class Home extends Component {
    state = {
        mode: 'dashboard',
        user: {},
        currentDataset: {},
    }

    componentDidMount() {
        // Load user information from the database:
        const { user } = this.props;
        if (Number.isInteger(user)) {
            var promise = controller.get('user', {
                userid: user
            })

            promise.then((data) => {
                this.setState({ user: data })
            })
        }
    }

    setMode = (_mode) => {
        this.setState({ mode: _mode });
    }

    openLabeler = (dataset) => {
        this.setState({
            ...this.state,
            currentDataset: dataset,
            mode: 'labeler',
        })
    }

    render() {

        const { mode } = this.state;

        return (
            <>
                <div
                    className={`
                        grid
                        w-screen
                        h-screen
                    `}
                    style={{
                        gridTemplateRows: "2.5rem 1fr",
                        gridTemplateColumns: "5rem 1fr"
                    }}
                >
                    <Header trim={true} />
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
                        className={`
                        row-start-2 col-start-2 
                        border-b border-t border-r
                        border-gray-300
                        border-opacity-50
                    `}>
                        {
                            mode === "dashboard" &&
                            <Dashboard
                                userid={this.props.user}
                                userinfo={this.state.user}
                                onLabel={this.openLabeler}
                            />
                        }
                        {
                            mode === "labeler" &&
                            <Labeler
                                userid={this.props.user}
                                userinfo={this.state.user}
                                dataset={this.state.currentDataset}
                            />
                        }
                    </GridDiv>
                </div>
            </>
        );
    }
};

export default Home;