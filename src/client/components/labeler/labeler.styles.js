/**
 * 
 */
import tw from 'tailwind-styled-components';

export const ToolbarButton = tw.button`
    flex
    rounded-full
    w-10 h-10 my-2 mx-1
    text-gray-400
    text-sm font-medium font-inter
    align-center justify-center items-center

    hover:cursor-pointer
    hover:text-theme
    hover:font-bold
    hover:ring-opacity-50

    focus:outline-none
    focus:bg-opacity-75
`

export const BreadCrumb = tw.ol`
    flex
    items-center
    h-full
    justify-start
    space-x-2
`

export const CloseButton = tw.div`
    flex
    w-full h-full
    text-gray-400
    row-start-1 col-start-1
    justify-center
    items-center
    align-middle
    hover:text-theme
    hover:font-bold
    hover:cursor-pointer
    border-r
`

export const Grid = tw.div`
    grid
    w-full
    h-full
`
export const Cell = tw.div`
    flex
    w-full
    h-auto
`

export const ToolbarContainer = tw.div`
    grid
    items-center
    text-sm 
    text-gray-500
    font-regular
    font-system
    tracking-wide
    w-full
    h-full
    bg-white
    border-b
    border-gray-200
    border-opacity-50
`

export const LabelToolContainer = tw.div`
    flex
    w-full
    align-middle 
    justify-center 
    py-8
    border-r
`

export const LabelToolIcon = tw.div`
    flex 
    items-center
    justify-center 
    w-10
    h-10
    rounded-sm
    transition-all
    duration-100
    ring-white
    hover:ring-theme
    hover:ring-opacity-75
    hover:cursor-pointer
`

export const Image = tw.img`
    flex
    rounded-md
    w-full
    h-auto
`

export const DatasetName = tw.a`
    mx-3
    text-sm 
    text-gray-500
    font-regular
    font-system
    tracking-wide
    overflow-hidden
    hover:text-theme
    hover:border-b
`

export const SampleName = tw.a`
    flex
    ml-1
    text-sm
    font-regular
    font-system
    font-bold
    text-theme
    uppercase
`