import { CheckboxProps } from '@material-ui/core';
import React from 'react';

export interface Props {
    row: boolean
    items: CheckboxProps[],
    labels: string[]
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked?: boolean) => void
}