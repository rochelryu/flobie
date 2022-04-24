import React from 'react'
import {InputAdornment, TextField} from '@mui/material';
import { Props } from '../../../Interfaces/Props/TextInputFieldProps'
import { className } from '../../../Constants/function'
import { colorPrimary, colorError, colorGrey } from '../../../Constants/color';
import {
    withStyles,
  } from '@mui/styles';
  const ValidationTextField = withStyles({
    root: {
      width: '90%',
      '& input:invalid + fieldset': {
        borderColor: colorError,
        borderWidth: 2,
      },
      '& input:valid:focus + fieldset': {
        borderColor: colorPrimary,
        borderWidth: 2,
        color: colorGrey,
        padding: '4px !important', // override inline-style
      },
      '& input': {
        maxWidth: '88%',
      }
    },
  })(TextField);


function TextInputField(props: Props) {
    return (
            <ValidationTextField
                id={props.id}
                className={className(['textInputField', props.className])}
                label={props.label}
                placeholder={props.placeholder}
                variant={props.variant}
                type={props.type || "text"}
                disabled={props.disabled}
                value={props.value}
                InputProps={{
                  readOnly: props.readOnly || false,
                  startAdornment: props.prefix ? <InputAdornment position="start">{props.prefix}</InputAdornment> : null,
                  endAdornment: props.suffix ? <InputAdornment position="end">{props.suffix}</InputAdornment> : null
                }}
                onChange={props.onChange}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
            />
    );
}
export default TextInputField;