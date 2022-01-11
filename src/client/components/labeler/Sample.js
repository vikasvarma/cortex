import React from 'react';
import tw from 'tailwind-styled-components';
import { FiBookmark } from 'react-icons/fi';

export const Card = tw.div`
    flex
    bg-white
    overflow-hidden
    flex-col
    border-black
    border-opacity-75
    border
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

export default class Sample extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: "",
        }
    }

    componentDidMount() {

        var request = new XMLHttpRequest();
        request.open('GET', this.props.sample.path, true);
        request.responseType = 'blob';
        request.onload = () => {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.addEventListener("load", (event) => {
                this.setState({ data: event.target.result });
            }, false);
        };
        request.send();

    }

    render() {
        return (
            <Card style={{...this.props.style}}>
                <Thumbnail src={this.state.data} alt=''/>
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