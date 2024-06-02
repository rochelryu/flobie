import React from "react";

export interface Props {
  title?: string;
  icon?: React.ReactNode;
  id: string;
  className?: string;
  variant?: "contained" | "outlined";
  disabled?: boolean;
  danger?: boolean;
  tooltip?: string;
  shape?: "circle" | "round";
  loading?: boolean;
  block?: boolean;
  type?: "primary" | "dashed" | "link" | "default" | "text";
  onClick: (event: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}
