import React from "react";
import { Button, Tooltip, Card, Avatar } from "antd";
import { Props } from "../../../Interfaces/Props/CardsProps";
const { Meta } = Card;

export default function Cards(props: Props) {
  // const HeartIcon = (props: any) => <Icon component={props.icon} {...props} />;
  if (props.tooltip) {
    return (
      <Tooltip title={props.tooltip}>
        <Card
          style={props.style}
          cover={props.cover}
          onClick={props.onClick}
          actions={props.actions}
        >
          <Meta
            avatar={props.avatar ? <Avatar src={props.avatar} /> : undefined}
            title={props.title}
            description={props.description}
          />
        </Card>
      </Tooltip>
    );
  } else {
    return (
      <Card
        style={props.style}
        cover={props.cover}
        onClick={props.onClick}
        actions={props.actions}
      >
        <Meta
          avatar={
            props.avatar ? (
              <Avatar src="https://joeschmoe.io/api/v1/random" />
            ) : undefined
          }
          title={props.title}
          description={props.description}
        />
      </Card>
    );
  }
}
