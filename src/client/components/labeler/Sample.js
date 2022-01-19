import React from 'react';
import tw from 'tailwind-styled-components';
import { FiBookmark } from 'react-icons/fi';

export const Card = tw.div`
    flex
    bg-white
    overflow-hidden
    flex-col
    px-3 py-3
    focus-within:shadow-lg
`

export const SampleName = tw.div`
    flex
    px-4
    justify-start
    items-center
    text-lg
    font-oswald
    uppercase
    truncate
    text-theme
`

export const Details = tw.div`
    flex
    w-full
`

export const Thumbnail = tw.img`
    flex
    object-cover
    h-full
    w-full
`

const path = window.require('path');

export default class Sample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            thumbnail: "",
        }
    }

    componentDidMount() {

        const { sample, datapath } = this.props;
        const filename = path.join(
            "file://", datapath, sample.path
        );

        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {
                this.setState({ thumbnail: event.target.result });
            }, false);
        };
        request.send();

    }

    render() {
        return (
            <Card style={{...this.props.style}}>
                <Thumbnail src={this.state.thumbnail} alt=''/>
                <div className="flex flex-row pt-2">
                    <div className="flex flex-grow align-middle justify-start">
                        <div className="font-regular uppercase font-poppins py-1"
                            style={{
                                fontSize: "9px",  
                            }}
                        >
                            <p>{this.props.sample.name}</p>
                        </div>
                        <div></div>
                    </div>
                    <div>
                        <FiBookmark 
                            style={{
                                strokeWidth: "1.5px",
                            }}
                        />
                    </div>
                </div>
            </Card>
        )
    }
}