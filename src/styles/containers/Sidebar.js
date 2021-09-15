import tw from 'tailwind-styled-components';
import { Link } from 'react-router-dom';

const SidebarContainer = tw.div`
    fixed
    w-20
    lg:w-52
    h-full
    bg-white
    bg-opacity-50
    backdrop-filter
    backdrop-blur-xl
    shadow-sm
`

export { SidebarContainer }