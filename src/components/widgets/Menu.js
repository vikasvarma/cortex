import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import tw from 'tailwind-styled-components';
import Button from './Button';

const MenuButton = tw(Menu.Button)`
	flex
	flex-row
	relative
	inline-flex
	justify-left
	items-center
	w-full
	h-full
	pl-4
	pr-2
	py-1
	truncate
	text-sm
	font-medium
	font-inter
	text-gray-500
	bg-transparent
	rounded-sm
	ring-opacity-20
	ring-2
	ring-theme
	hover:ring-opacity-50
	hover:bg-theme
	hover:bg-opacity-50
	hover:text-white
	focus:outline-none
	transition 
	duration-200
`

const MenuItems = tw(Menu.Items)`
	absolute 
	w-56 
	mt-2
	z-10
	origin-top-left
	bg-white 
	rounded-md 
	shadow-lg 
	ring-1 
	ring-black 
	ring-opacity-5 
	focus:outline-none
`

function MenuItem({
	entry
}){
	return(
		<Menu.Item>
            {({ active }) => (
                <button
                    className={`${
                      active ? 'bg-theme bg-opacity-50 text-white' : 'text-gray-900'
                    } group flex rounded-sm items-center w-full px-3 py-2 text-sm focus:outline-none`}
                >
                    {
						<div className="w-5 h-5 mr-2" aria-hidden="true">
							<img src = {entry.icon} />
					  	</div>
                    }
                    {entry.name}
                </button>
            )}
        </Menu.Item>
	);
}

function DropdownMenu({
	label,
	icon,
	data
}) {
	return(
		<Menu as="div" className = "p-2">
			<MenuButton>
				{label}
				<div className = "w-5 h-5 ml-4"> {icon} </div>
			</MenuButton>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<MenuItems static>
					{
						data.map((entry) => {
							return(
								<MenuItem entry = {entry} />
							)
						})
					}
				</MenuItems>
			</Transition>
		</Menu>
	);
}

export default DropdownMenu;