/*
    EditField - React component class for user inputs.
 */

import React from 'react';
import tw from 'tailwind-styled-components';

const Container = tw.div`
    relative
    flex
    flex-row
    rounded-md
    bg-opacity-0
`

const Input = tw.input`
    focus:ring-theme
    focus:border-theme
    truncate
    w-full
    border-gray-300 
    rounded-md
    text-sm
    font-inter
    text-md
    text-gray-700
    bg-opacity-0
    bg-transparent
    active:outline-none
    focus:outline-none
`

const Label = tw.div`
    block
    text-gray-700
    my-1
`

function EditField({
    label,
    style,
    placeholder,
    grow = false
}) {

    return(
        <>
        { label && <Label> {label} </Label> }
        <Container className = {grow ? "flex-grow" : null}>
            <Input
                className = {style}
                placeholder = {placeholder}
            />
        </Container>
        </>
    );
}

export default EditField;