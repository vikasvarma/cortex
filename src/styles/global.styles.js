import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        border: 0px;
        padding: 0px;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
    }

    .root{
        width: 100%;
        height: 100%;
        border: 0px;
        padding: 0px;
    }
`

export default GlobalStyle;