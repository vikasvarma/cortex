import React from 'react';
import tw from 'tailwind-styled-components';
import { HiOutlinePhotograph, HiOutlineBookmark } from 'react-icons/hi';
import { AiOutlineDelete } from 'react-icons/ai';

export const Card = tw.div`
    grid
    bg-white
    overflow-hidden
    border-black
    border-opacity-75
    border
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
            <Card
                style={{
                    ...this.props.style,
                    gridTemplateRows: "2.5rem 1fr 2rem",
                    gridTemplateColumns: "1fr 6rem",
                }}
            >
                <div className="flex flex-row row-start-1 col-span-full border-b border-black border-opacity-75">
                    <div className="flex w-14 h-full flex-row place-items-center bg-opacity-20 bg-theme justify-center">
                        <HiOutlinePhotograph className="w-4 h-4 text-gray-700" />
                    </div>
                    <div className="flex w-full h-full place-items-center justify-start row-start-1 col-span-2 col-start-2 border-l border-r border-black border-opacity-75">
                        <p className="flex w-full h- full uppercase pl-4 text-xs font-medium font-roboto">{this.props.sample.name}</p>
                    </div>
                    <div className="flex w-14 h-full row-start-1 col-start-4 place-items-center justify-center bg-gray-400 text-gray-400 hover:bg-red-300 hover:text-gray-700 bg-opacity-40">
                        <AiOutlineDelete className="w-4 h-4" />
                    </div>
                </div>
                <div className="flex relative place-items-center row-start-2 row-span-full col-start-1 cols-span-3">
                    <Thumbnail src={this.state.data} alt='' className="z-10" />
                </div>
                <Details className="flex-col col-start-2 row-start-2 row-span-full place-items-center border-l border-black border-opacity-75">
                    <div className="flex w-full h-7 row-start-1 col-start-4 place-items-center justify-end px-1">
                        <HiOutlineBookmark className="w-4 h-4" />
                    </div>
                    <div className="flex-grow bg-theme bg-opacity-20"></div>
                </Details>
                <div className="flex w-full border-t border-black border-opacity-75 col-start-2 row-start-3">
                    <p className="flex flex-grow justify-center place-items-center uppercase text-xs font-medium font-roboto bg-theme bg-opacity-40">
                        {this.props.sample.status}
                    </p>
                </div>
            </Card>
        )
    }
}