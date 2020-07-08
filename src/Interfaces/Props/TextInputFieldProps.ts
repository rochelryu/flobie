import React from 'react';

export interface Props {
    value?: string | number,
    label?: string,
    placeholder?: string,
    id: string,
    required: boolean,
    variant?: "outlined" | "filled",
    type?: "number" | "text" | "password",
    prefix?: React.Component | string
    suffix?: any
    readOnly?: boolean,
    className: string, 
    defaultValue?: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onFocus?: (e: any) => void
    onBlur?: (e: any) => void
    onClick?: (e: any) => void
     
}