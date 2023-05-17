import React from "react";
import { AppBar, Grid } from "@mui/material";
import MegaTitleProps from "../MegaTitle/MegaTitle";
import { format } from "date-fns";
import { className } from "../../../Constants/function";
import "./BoxConversation.scss";
import { Image, Tag } from "antd";

export default function BoxConversation(props: any) {
  return (
    <Grid
      container
      className="boxConversation"
      spacing={1}
      style={{ padding: 5, position: "relative", height: 600 }}
    >
      <div className="appBar" style={{ padding: 5 }}>
        <MegaTitleProps title={props.conversation.productName} size="sm" />
        <Tag color="magenta">{props.conversation._id}</Tag>
        <Tag color="geekblue">{props.conversation.room}</Tag>
      </div>
      <div className="chat-history">
        <ul>
          {props.conversation.content.map((value: any) => (
            <li
              className={className([
                value.ident.trim() === value.room.split("_")[0]
                  ? "clearfix"
                  : "",
              ])}
            >
              <div
                className={className([
                  "message-data",
                  value.ident.trim() === value.room.split("_")[0]
                    ? "align-right"
                    : "",
                ])}
              >
                <span className="message-data-time">
                  {format(new Date(value.date), "dd/MMM/yyyy HH:mm")}
                </span>{" "}
                &nbsp; &nbsp;
                <span className="message-data-name">
                  {value.ident.trim() === value.room.split("_")[0] ? (
                    <a
                      key={"moreWha" + new Date(value.date).getTime()}
                      href={`https://wa.me/${props.seller.contact.replace(
                        "+",
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Vendeur ({props.seller.name.split(" ")[0]})
                    </a>
                  ) : (
                    <a
                      key={"moreWha" + new Date(value.date).getTime()}
                      href={`https://wa.me/${props.buyer.contact.replace(
                        "+",
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Acheteur ({props.buyer.name.split(" ")[0]})
                    </a>
                  )}
                </span>{" "}
                <i className="fa fa-circle me"></i>
              </div>
              <div
                className={className([
                  "message",
                  value.ident.trim() === value.room.split("_")[0]
                    ? "other-message float-right"
                    : "my-message",
                ])}
              >
                {value.image !== "" ? (
                  value.image.indexOf(".m4a") !== -1 ? (
                    <audio
                      controls
                      src={`${props.consumeApi.AssetConversationServer}${props.conversation._id}/${value.image}`}
                    ></audio>
                  ) : (
                    <Image
                      width={200}
                      src={`${props.consumeApi.AssetConversationServer}${props.conversation._id}/${value.image}`}
                    />
                  )
                ) : (
                  ""
                )}
                {value.content !== "" ? <p>{value.content}</p> : ""}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  );
}
