/*
 * 
 */
import React from 'react';
import tw from 'tailwind-styled-components';
import DropdownMenu from '../widgets/Menu';
import { 
	PlusIcon, 
	BellIcon,
	CogIcon,
	MenuAlt3Icon
} from '@heroicons/react/outline'

import people from './Dropdowndata';

const NotificationDot = tw.div`
	animate-pulse
	h-1.5 
	w-1.5 
	bg-theme 
	rounded-full
	absolute 
	inline-flex 
	opacity-75
`

const ControlPanel = tw.div`
	w-full
	h-full
	grid
	gap-x-1
	items-center
	justify-end
	pr-4
	pl-1
	border-b
	border-gray-300
	border-opacity-50
`

function Notifications({showDot, style}){
  	return(
		<div className = {style}>
			<BellIcon className = "absolute h-5 w-5"/>
			{
				showDot && <NotificationDot className = "absolute mx-5 mb-3"/>
			}
		</div>
  	);
}

function Controlbar({
	detailsCallback
}) {
	let iconstyle = "w-10 h-8 px-2 py-1.5 text-gray-500 flex-shrink-0 hover:text-theme transition duration-200 hover:bg-opacity-75 hover:cursor-pointer";

    return (
      	<ControlPanel
      		style = {{
      			gridTemplateColumns : "1fr auto auto auto"
    		}}
  		>
			<div 
			className = {`
				flex
				flex-grow
				justify-end
			`}
			>
			<DropdownMenu 
				icon = {<PlusIcon />}
				label = "Import"
				data = {people}
			/>
			</div>
			<CogIcon className = {iconstyle}/>
			<Notifications showDot = {true} style = {iconstyle}/>
			<MenuAlt3Icon className = {iconstyle} onClick = {detailsCallback}/>
    	</ControlPanel>         
   );
}

export default Controlbar;