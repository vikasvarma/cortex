import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

function RadioButtons({
    data,
    selection = 0,
    showLabel = true
}) {
    
    const [selected, setSelected] = useState(selection);

    return(
        <RadioGroup value={selected} onChange={setSelected}>
            <div className="space-y-2">
                {data.map((entry) => (
                    <RadioGroup.Option
                        key = {entry.id}
                        value = {entry}
                        className = "focus:outline-none"
                    >
                    {({ active, checked }) => (
                        <div 
                            className={`
                                flex 
                                items-center
                                pl-5 
                                w-full
                                font-inter
                                font-medium
                                cursor-pointer 
                                border-r-4
                                border-theme
                                transition-all
                                duration-100
                                ${
                                    checked ? 
                                    'border-opacity-75 text-theme text-opacity-75' : 'border-opacity-0 text-gray-400'
                                }
                            `}
                            style = {{
                                fontSize: "14px"
                            }}
                        >
                            <div
                                className = {`
                                    w-10
                                    h-10
                                    flex
                                    items-center
                                    justify-center
                                `}
                            >
                            {checked ? entry.activeicon : entry.inactiveicon}
                            </div>
                            {
                                showLabel &&
                                <RadioGroup.Label as="p" 
                                    className = {`
                                        flex
                                        h-10 pl-2 
                                        content-center
                                        items-center
                                    `}
                                >
                                    {entry.label}
                                </RadioGroup.Label>
                            }
                        </div>
                    )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    );
}

export default RadioButtons;