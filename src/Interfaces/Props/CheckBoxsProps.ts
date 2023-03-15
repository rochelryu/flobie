import { CheckboxProps } from "@mui/material";
import React from "react";

export interface Props {
  row: boolean;
  items: CheckboxProps[];
  labels: string[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked?: boolean
  ) => void;
}
