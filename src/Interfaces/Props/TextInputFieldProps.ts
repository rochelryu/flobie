import React from 'react';

export interface Props {
    value?: string | number,
    label?: string,
    placeholder?: string,
    id: string,
    required: boolean,
    variant?: "outlined" | "filled" | "standard",
    type?: "number" | "text" | "password",
    prefix?: any
    suffix?: any
    readOnly?: boolean,
    disabled?: boolean,
    className: string, 
    defaultValue?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: (e: any) => void
    onBlur?: (e: any) => void
    onClick?: (e: any) => void
     
}