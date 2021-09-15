import React from 'react';
import { SidebarData } from './SidebarData';
import Button from '../widgets/Button';
import RadioButtons from '../widgets/RadioGroup';
import tw from 'tailwind-styled-components';
import * as outline from '@heroicons/react/outline';

const SidebarContainer = tw.div`
    flex
    h-full
	w-full
    bg-white
    grid
    border-r
    border-gray-300
    border-opacity-50
`;

let avatar = 'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

let name = "Vikas Varma";

function Sidebar({collapsed, handler}){
    return(
        <SidebarContainer style = {{gridTemplateRows : "auto auto 80px"}}>
			<div 
				className = {`
					py-5
				`}
			>
				<RadioButtons data = {SidebarData} showLabel = {!collapsed}/>
			</div>
			<div></div>
			<div className = {`
					flex
					flex-shrink-0
					items-center
					pl-5
					pr-3
				`}>
					<img src = {avatar} className = {`
						w-10
						h-10
						rounded-full
						${
							collapsed ? 
							'hover:cursor-pointer' : 
							'hover:cursor-default' 
						}
					`}/>
					{
						!collapsed &&
						<div className = {`
							h-9
							flex 
							flex-col
							flex-grow 
							font-inter 
							overflow-clip
							align-center
							pl-3
							pr-2
						`}>
							<div 
								className = {`
									font-bold
									text-theme
									text-opacity-70
									hover:cursor-default
								`}
								style = {{
									fontSize: "13px"
								}}
							>
								{name}
							</div>
							<div 
								className = {`
									font-normal
									text-gray-500
									hover:cursor-default
								`}
								style = {{
									fontSize: "10px"
								}}
							>
								Admin
							</div>
						</div>
					}
				{
					!collapsed &&
					<outline.DotsVerticalIcon className = {`
						h-6
						flex
						text-gray-300 
						flex-shrink-0
						hover:text-theme 
						transition 
						duration-200 
						hover:text-opacity-50
						hover:cursor-pointer
					`}/>
				}
			</div>
        </SidebarContainer>
    );
};

export default Sidebar;