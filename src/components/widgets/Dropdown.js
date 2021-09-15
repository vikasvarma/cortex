/*
 *   
 */
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import tw from 'tailwind-styled-components'

const Label = tw(Listbox.Label)`
    mb-1
    font-medium
    font-inter
    text-gray-700
`

const Button = tw(Listbox.Button)`
    flex
    flex-row
    h-full
    bg-white 
    border-none
    border-gray-300 
    rounded-sm
    list-none
    text-left
    text-sm
    items-center
    justify-items-stretch
    cursor-default 
    active:outline-none 
    focus:outline-none
    focus:border-theme
`

const Icon = tw.img`
    flex-shrink-0
    h-6
    w-6
    rounded-full
`

const EntryLabel = tw.span`
    w-full
    flex
    mx-2
    truncate
`

const Selector = tw.span`
    flex
    mx-2
    my-2.5
    ml-auto
    pointer-events-none  
`

const Options = tw(Listbox.Options)`
    fixed
    flex
    flex-col
    mt-1
    z-10
    bg-white 
    shadow-lg 
    max-h-56 
    rounded-md 
    py-2 
    text-sm
    ring-1 
    ring-black 
    ring-opacity-5 
    overflow-y-auto 
    focus:outline-none
    active:outline-none
`

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Entry({entry, selected, enableHover, style}){
    return(
        <Listbox.Option
            key = {entry.id}
            className = {({active}) => classNames(
                (active && enableHover ? "text-white bg-theme " : "text-gray-500 "), "flex flex-row justify-items-stretch cursor-default select-none pl-3 pr-5 py-2 active:outline-none focus:outline-none"
            )}
            style = {style}
            value={entry}
        >
            <span className="flex w-full items-center">
                {
                    entry.icon && <Icon src={entry.icon} alt=""/>
                }
                <EntryLabel>
                    {entry.name}
                </EntryLabel>
                {({active}) => (
                    active && enableHover ? (
                        <div className={active ? 'text-white' : 'text-theme'}/>
                    ) : null
                )}
                {
                    selected && <CheckIcon 
                        className="h-5 w-5 ml-auto text-gray-400"/>
                }
            </span>
        </Listbox.Option>
    );
}

function Dropdown({
    data,
    label,
    width = 50,
    height = 10,
    style
}) {
    const [selected, setSelected] = useState(data[1]);

    return (
        <Listbox as='div' value={selected} onChange={setSelected}>
        {
            ({ open }) => (
                <>
                {
                    label && <Label>{label}</Label>
                }
                <Button style = {{
                        width    : (width * 4).toString()  + "px",
                        maxWidth : (width * 4).toString()  + "px",
                        height   : (height * 4).toString() + "px",
                        maxHeight: (height * 4).toString() + "px"
                    }}
                    className = {style}
                >
                    <Entry entry = {selected} enableHover = {false} />
                    <Selector>
                        <SelectorIcon 
                            className="h-5 w-5 text-gray-400" 
                            aria-hidden="true" 
                        />
                    </Selector>
                </Button>
                <Transition
                    show = {open}
                    as = {Fragment}
                    enter="transform duration-200 transition ease-in-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100 translate-y-0 duration-200"
                >
                    <Options static>
                        {
                            data.map((entry) => {
                                return (
                                    <Entry 
                                        entry = {entry}
                                        enableHover = {true}
                                        selected = {entry.id==selected.id}
                                        style = {{
                                            width: (width*4).toString()+"px",
                                            maxWidth: (width*4).toString()+"px"
                                        }}
                                    />
                                );
                            })
                        }
                    </Options>
                </Transition>
                </>
            )
        }
        </Listbox>
    )
};

export default Dropdown;