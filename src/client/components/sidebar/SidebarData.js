import React from 'react';
import * as outline from '@heroicons/react/outline';
import * as solid from '@heroicons/react/solid';
import {
    RiPenNibLine, 
    RiShapeLine, 
    RiCheckboxBlankCircleLine,
    RiBrushLine,
    RiEraserLine
} from 'react-icons/ri';
import {HiOutlineSwitchHorizontal} from 'react-icons/hi';
import {BiShapeTriangle} from 'react-icons/bi';

let iconStyle = "w-5 h-5 cursor-pointer";

export const SidebarData = [,
    {
        id: 'bounding-box',
        icon: <RiShapeLine className={iconStyle}/>,
        ref: "/bounding-box"
    },
    {
        id: 'freehand',
        icon: <RiPenNibLine className={iconStyle}/>,
        ref: "/freehand"
    },
    {
        id: 'polygon',
        icon: <BiShapeTriangle className={iconStyle}/>,
        ref: "/polygon"
    },
    {
        id: 'circle',
        icon: <RiCheckboxBlankCircleLine className={iconStyle}/>,
        ref: "/circle"
    },
    {
        id: 'paint',
        icon: <RiBrushLine className={iconStyle}/>,
        ref: "/paint"
    },
    {
        id: 'eraser',
        icon: <RiEraserLine className={iconStyle}/>,
        ref: "/eraser"
    },
    {
        id: 'swap',
        icon: <HiOutlineSwitchHorizontal className={iconStyle}/>,
        ref: "/swap"
    }
];

export const CollectionData = [,
    {
        label: 'Dashboard',
        activeicon: <solid.TemplateIcon />,
        inactiveicon: <outline.TemplateIcon />,
        ref: "/dashboard"
    },
    {
        label: 'Recent',
        activeicon: <solid.ClockIcon />,
        inactiveicon: <outline.ClockIcon />,
        ref: "/recent"
    },
    {
        label: 'Automation',
        activeicon: <solid.EyeIcon />,
        inactiveicon: <outline.EyeIcon />,
        ref: "/automation"
    }
];