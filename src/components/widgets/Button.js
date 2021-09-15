import React from 'react';
import tw from 'tailwind-styled-components';

const StyledButton = tw.button`
    flex
    flex-row
    items-center
    w-full
    h-full
    px-3
    py-1
    text-sm
    font-medium
    font-inter
    text-gray-500
    rounded-sm
    ring-2
    ring-opacity-20
    ring-theme
    hover:ring-opacity-50
    hover:bg-theme
    hover:bg-opacity-50
    hover:text-white
    focus:outline-none
    transition 
    duration-200
`

function Button({
    label,
    icon,
    iconPosition = "start"
}) {
    return(
        <StyledButton>
            <>
                { 
                    iconPosition == "start" && 
                    <div className="w-5 h-5 mx-1"> {icon} </div>
                }
                <div 
                    className = {`
                        flex
                        flex-grow 
                        px-2
                        justify-start
                    `}
                >
                    {label}
                </div>
                { 
                    iconPosition == "end" &&
                    <div className="w-5 h-5"> {icon} </div>
                }
            </>
        </StyledButton>
    );
}

export default Button;