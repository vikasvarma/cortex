import React from 'react';
import { NotificationIcon, SearchIcon, SettingsIcon } from '../Icons';
import { LargeDatasetCard, SmallDatasetCard } from './DatasetCard';
import ServerDispatcher from '../../Dispatcher';
import styled from 'styled-components';
import CreateDatasetDialog from './CreateDataset';
import Welcome from './Welcome';

const GridContainer = styled.div`
    display: flex;
    justify-content: center; // 1
    flex-flow: column wrap; // 2
    width: 100%;
    height: 100%;
`;

const GridList = styled.div`
  display: flex;
  justify-content: space-evenly; // 3
  flex-flow: row wrap; // 4
`;

const controller = new ServerDispatcher();

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            workingset: 0,
            showDialog: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        // Load sample information from the server:
        const { userid } = this.props;
        if (Number.isInteger(userid)) {
            var promise = controller.get('dataset', {
                userid: userid
            })

            promise.then((data) => {
                // Parse sample information from data and load it.
                if (data != undefined && data.length > 0) {
                    this.setState({ projects: data })
                }
            })
        }
    }

    toggleDialog = () => {
        this.setState({ showDialog: !this.state.showDialog });
    }

    openFolder = (path) => {
        const { exec } = window.require('child_process');
        const cmd = "cd " + path + "; open .";
        exec(cmd);
    }

    addDataset = (info) => {
        // Send new dataset info to the backend:
        const json = {
            ...info,
            userid: this.props.userid,
        }
        const promise = controller.send("PUT", "dataset", json);

        promise.then((data) => {
            if (data != undefined) {
                var proj = this.state.projects;
                proj.push(data);
                this.setState({
                    projects: proj
                })
            }
        })

        // Hide the dialog:
        this.toggleDialog()
    }

    removeDataset = (key) => {
        // Send request to remove dataset from backend:
        const json = {
            userid: this.props.userid,
            dataid: this.state.projects[key].id
        }
        const promise = controller.send("DELETE", "dataset", json);
        promise.then((data) => {
            if (data.status === 0) {
                var projects = this.state.projects;
                projects.splice(key, 1);
                this.setState({
                    projects: projects
                });
            }
        })
    }

    render() {

        const { userinfo, onLabel } = this.props;

        return (
            <>
                {
                    !this.state.isLoading &&
                        this.state.projects.length === 0
                        ?
                        <Welcome
                            username={
                                Object.keys(userinfo).length > 0 ?
                                    userinfo.name : ""
                            }
                            onCreate={this.toggleDialog}
                        />
                        :
                        <div className="flex w-full h-full">
                            <div className="flex flex-grow flex-col"
                                style={{
                                    height: "100vh",
                                }}
                            >
                                <div className="grid grid-flow-row w-full px-6 py-4"
                                    style={{
                                        gridTemplateColumns: "150px 1fr 2fr 120px"
                                    }}
                                >
                                    <p className="flex font-poppins font-semibold text-2xl">Dashboard</p>
                                    <div id="space" />
                                    <div className="flex px-2 items-center border-b border-black">
                                        <SearchIcon />
                                        <input
                                            type="text"
                                            id="search"
                                            className="flex-grow text-gray-500 text-sm mx-2 truncate active:outline-none focus:outline-none"
                                            placeholder="Search"
                                        />
                                        <NotificationIcon className="ml-3" />
                                        <SettingsIcon className="ml-3" />
                                    </div>
                                    <button
                                        className="flex font-poppins font-regular place-content-center items-center ml-2 bg-black rounded-sm text-white text-sm focus:outline-none"
                                        onClick={this.toggleDialog}
                                    >
                                        Create
                                    </button>
                                </div>
                                <div className="px-6 overflow-auto">
                                    <div className="flex w-full pt-1 pb-6 border-black border-b"
                                        style={{
                                            height: "45%",
                                            maxHeight: "50vh",
                                        }}
                                    >
                                        {
                                            this.state.projects.length > 0 && <LargeDatasetCard
                                                index={this.state.workingset}
                                                data={this.state.projects[this.state.workingset]}
                                                onOpen={this.openFolder}
                                                onDelete={this.removeDataset}
                                                onEdit={onLabel}
                                            />
                                        }
                                    </div>
                                    <div className="flex flex-col pt-4">
                                        <div className="flex flex-row mb-4">
                                            <p className="flex font-semibold font-poppins text-xl">Datasets</p>
                                        </div>
                                        <div className="flex mb-20 flex-wrap flex-row gap-4">
                                            {
                                                this.state.projects.map((dataset, ind) => (
                                                    <SmallDatasetCard
                                                        key={ind}
                                                        index={ind}
                                                        data={dataset}
                                                        style={{
                                                            width: "25%",
                                                            height: "300px",
                                                            maxWidth: "300px",
                                                            minWidth: "250px",
                                                        }}
                                                        onOpen={this.openFolder}
                                                        onEdit={onLabel}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex h-full border-l border-black"
                                style={{
                                    minWidth: "30vw",
                                    maxWidth: "1000px",
                                    width: "100%",
                                    height: "100vh",
                                }}
                            >
                            </div>
                        </div>
                }
                {
                    this.state.showDialog &&
                    <CreateDatasetDialog
                        onCancel={this.toggleDialog}
                        onSubmit={this.addDataset}
                    />
                }
            </>
        );
    }
}