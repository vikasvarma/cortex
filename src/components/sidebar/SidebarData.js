import React from 'react';
import * as outline from '@heroicons/react/outline';
import * as solid from '@heroicons/react/solid';

let iconStyle = "w-6 h-6";

export const SidebarData = [,
    {
        label: 'Dashboard',
        activeicon: <solid.TemplateIcon className = {iconStyle}/>,
        inactiveicon: <outline.TemplateIcon className = {iconStyle}/>,
        ref: "/dashboard"
    },
    {
        label: 'Recent',
        activeicon: <solid.ClockIcon className = {iconStyle}/>,
        inactiveicon: <outline.ClockIcon className = {iconStyle}/>,
        ref: "/recent"
    },
    {
        label: 'Automation',
        activeicon: <solid.AnnotationIcon className = {iconStyle}/>,
        inactiveicon: <outline.AnnotationIcon className = {iconStyle}/>,
        ref: "/automation"
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