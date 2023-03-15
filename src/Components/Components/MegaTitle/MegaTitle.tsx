import React from "react";
import { Grid } from "@mui/material";
import { Props } from "../../../Interfaces/Props/MegaTitleProps";

function MegaTitleProps(props: Props) {
  let size = 13;
  switch (props.size) {
    case "xs":
      size = 13;
      break;
    case "sm":
      size = 18;
      break;
    case "md":
      size = 24;
      break;
    case "lg":
      size = 36;
      break;
    case "xl":
      size = 64;
      break;
    default:
      size = 15;
      break;
  }
  return (
    <Grid item xs={12}>
      <h1 style={{ fontSize: size, color: props.color ?? "#000", margin: 0 }}>
        {props.title.toLocaleUpperCase()}
      </h1>
    </Grid>
  );
}
export default MegaTitleProps;
