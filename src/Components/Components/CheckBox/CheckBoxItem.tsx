import React from 'react'
import { withStyles } from '@mui/styles';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import { colorGrey, colorPrimary } from '../../../Constants/color';


function CheckBoxItem(props: CheckboxProps) {
    const SimpleCheckbox = withStyles({
        root: {
          color: colorGrey,
          '&$checked': {
            color: colorPrimary,
          },
        },
        checked: {},
      })((props: CheckboxProps) => <Checkbox color="default" {...props} />);
    
    return (
        <SimpleCheckbox
            id={props.id}
            disabled={props.disabled}
            className={props.className}
            checked={props.checked}
            onChange={props.onChange}
            name={props.name}
        />
    )
}

export default CheckBoxItem;