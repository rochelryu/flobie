import React from "react";

export interface Props {
  pictureDeals: string;
  productName: string;
  _id: string;
  className?: string;
  room: string;
  disabled?: boolean;
  lastDate: Date;
  etatCommunication: string;
  lastContent: {image:string, date:Date, ident:string, room:string, content:string, isReadByOtherUser:boolean};
  lengthMessage: number;
  onClick: (event: any) => void;
  onFocus?: (e: any) => void;
  onBlur?: (e: any) => void;
}
