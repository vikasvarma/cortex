import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
        to right top,
        #FAD7DF,
        #DBF2FF
    );
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
`
const Glass = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
        to right bottom,
        rgba(255,255,255,0.4),
        rgba(255,255,255,0.1)
    );
    position: absolute;
    backdrop-filter: blur(10rem);
`

const Circle = styled.div`
    background: radial-gradient(
        rgba(255,255,255,1),
        rgba(255,255,255,0)
    );
    position: absolute;
    border-radius: 50%;
`

class HomeContainer extends React.Component{
    render(){
        return(
            <>
                <Container>
                    <Circle style = {{
                        width: "80vw",
                        height: "80vw",
                        top: "-40vw",
                        left: "-40vw",
                        opacity: "0.8"
                    }}/>
                    <Circle style = {{
                        width: "80vh",
                        height: "50vh",
                        bottom: "-30vh",
                        opacity: "0.5"
                    }}/>
                    <Glass />
                </Container>
            </>
        );
    }
}

export { HomeContainer }