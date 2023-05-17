import React from "react";
import { color_primary } from "../../../Constants/ClassName/Color";
import {
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  Typography,
} from "@mui/material";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Props } from "../../../Interfaces/Props/ConversationUserItem";
import { Tag } from "antd";
import { EtatCommunication } from "../../../Enum/ServerSide/Enum";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 13,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

export default function ConversationUserItem(props: Props) {
  const lastWrite =
    props.room.split("_")[0] === props.lastContent.ident
      ? "Vendeur"
      : "Acheteur";
  const content =
    props.lastContent.content !== ""
      ? props.lastContent.content.length <= 48
        ? props.lastContent.content
        : `${props.lastContent.content.substring(0, 47)}...`
      : props.lastContent.image.indexOf(".m4a") !== -1
      ? "🎤 une note vocale a été envoyé"
      : "🖼️ une image a été envoyé";
  let tag: any;
  switch (props.etatCommunication) {
    case EtatCommunication.BEGIN:
      tag = (
        <Tag icon={<SyncOutlined spin />} color="processing">
          En négociation
        </Tag>
      );
      break;

    case EtatCommunication.ACCORD_SELLER:
      tag = (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          Proposition vendeur
        </Tag>
      );
      break;
    case EtatCommunication.ACCORD_SELLER_BUYER:
      tag = (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Accord vendeur/acheteur
        </Tag>
      );
      break;
    case EtatCommunication.SELLER_UNAVAILABLE:
      tag = (
        <Tag icon={<MinusCircleOutlined />} color="default">
          Produit non recupéré
        </Tag>
      );
      break;
    case EtatCommunication.BUYER_NOT_VALIDATE:
      tag = (
        <Tag icon={<CloseCircleOutlined />} color="error">
          Client insatisfait
        </Tag>
      );
      break;
    default:
      tag = <Tag color="#f50">props.etatCommunication</Tag>;
      break;
  }
  return (
    <>
      <ListItem alignItems="flex-start" onClick={props.onClick}>
        <ListItemButton>
          <StyledBadge badgeContent={props.lengthMessage} color="secondary">
            <ListItemAvatar>
              <Avatar alt={props._id} src={props.pictureDeals} />
            </ListItemAvatar>
          </StyledBadge>

          <ListItemText
            primary={props.productName}
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {lastWrite}
                </Typography>
                {` — ${content}`}
                <div>{tag}</div>
              </React.Fragment>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}
