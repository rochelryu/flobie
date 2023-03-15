import React from "react";
import { FormControlLabel, FormGroup } from "@mui/material";
import CheckBoxItem from "./CheckBoxItem";
import { Props } from "../../../Interfaces/Props/CheckBoxsProps";

function CheckBoxs(props: Props) {
  return (
    <FormGroup row={props.row}>
      {props.items.map((item, index) => (
        <FormControlLabel
          control={
            <CheckBoxItem
              id={item.id}
              className={item.className}
              checked={item.checked}
              onChange={props.onChange}
              name={item.name}
              disabled={item.disabled}
            />
          }
          label={props.labels[index]}
          key={index}
        />
      ))}
    </FormGroup>
  );
}

export default CheckBoxs;
