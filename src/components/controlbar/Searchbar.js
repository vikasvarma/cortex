/**
 * 
 */

import React from 'react';
import EditField from '../widgets/Editfield';
import Dropdown from '../widgets/Dropdown';
import { SearchIcon } from '@heroicons/react/outline'


import people from './Dropdowndata';

function Searchbar(){
    return (
        <>
          	<div
                className = {`
                flex
                items-center
                font-inter  
                w-full
                bg-white
                border-b
                border-gray-300
                border-opacity-50
            `}
            >
              	<SearchIcon className = {`
                    w-10 
                    h-8 
                    px-2 
                    py-1.5 
                    text-gray-500 
                    flex-shrink-0
                `}/>
              	<Dropdown 
                  	data  = {people}
                  	style = "bg-opacity-0 ml-auto"
                  	width = {50} height = {12}
              	/>
              	<EditField placeholder="Search" style="mx-2" grow = {true}/>
          	</div>
      	</>           
   );
}

export default Searchbar;