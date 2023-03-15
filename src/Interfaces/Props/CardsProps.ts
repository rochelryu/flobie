import React from "react";

export interface Props {
  title?: string;
  style?: React.CSSProperties;
  description?: string;
  cover?: React.ReactNode;
  avatar?: string;
  actions?: React.ReactNode[];
  id: string;
  className?: string;
  tooltip?: string;
  onClick?: (event: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}
