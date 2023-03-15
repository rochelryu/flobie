import React, { useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  Toolbar,
  CssBaseline,
  Divider,
  AppBar,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { Space } from "antd";

import {
  ApiTwoTone,
  DashboardTwoTone,
  SettingTwoTone,
  ReconciliationTwoTone,
} from "@ant-design/icons";
import MenuIcon from "@mui/icons-material/Menu";
import MegaTitleProps from "../MegaTitle/MegaTitle";

import { colorPrimary } from "../../../Constants/color";
import "./MenuLeft.scss";
import {
  btn_color_primary,
  shadow_2,
} from "../../../Constants/ClassName/Buttons";
import { className } from "../../../Constants/function";
import { BuiltinRoleAdmin } from "../../../Constants/Enum";
interface Props {
  url?: string;
}

const url_dahsbord = (role: string) => {
  const castRole = role as BuiltinRoleAdmin;
  switch (castRole) {
    case BuiltinRoleAdmin.SUPER_ADMIN:
      return "/home";

    case BuiltinRoleAdmin.ADMIN_ACTUALITY:
      return "/home/actuality";
    case BuiltinRoleAdmin.ADMIN_DEALS:
      return "/home/deals";
    case BuiltinRoleAdmin.ADMIN_EVENTS:
      return "/home/event";
    case BuiltinRoleAdmin.ADMIN_COVOITURAGES:
      return "/home/covoiturage";

    case BuiltinRoleAdmin.EMPLOYER_ACTUALITY:
      return "/home/actualityEmployer";
    case BuiltinRoleAdmin.EMPLOYER_DEALS:
      return "/home/dealsEmployer";
    case BuiltinRoleAdmin.EMPLOYER_EVENTS:
      return "/home/eventEmployer";
    case BuiltinRoleAdmin.EMPLOYER_COVOITURAGES:
      return "/home/covoiturageEmployer";

    case BuiltinRoleAdmin.SMALL_LEVEL:
      return "/home/viewer";
    default:
      return "/home/logout";
  }
};

const params_dahsbord = (role: string) => {
  const castRole = role as BuiltinRoleAdmin;
  switch (castRole) {
    case BuiltinRoleAdmin.SUPER_ADMIN:
      return "";

    case BuiltinRoleAdmin.ADMIN_ACTUALITY:
      return "actuality";
    case BuiltinRoleAdmin.ADMIN_DEALS:
      return "deals";
    case BuiltinRoleAdmin.ADMIN_EVENTS:
      return "event";
    case BuiltinRoleAdmin.ADMIN_COVOITURAGES:
      return "covoiturage";

    case BuiltinRoleAdmin.EMPLOYER_ACTUALITY:
      return "actualityEmployer";
    case BuiltinRoleAdmin.EMPLOYER_DEALS:
      return "dealsEmployer";
    case BuiltinRoleAdmin.EMPLOYER_EVENTS:
      return "eventEmployer";
    case BuiltinRoleAdmin.EMPLOYER_COVOITURAGES:
      return "covoiturageEmployer";

    case BuiltinRoleAdmin.SMALL_LEVEL:
      return "viewer";
    default:
      return "logout";
  }
};

const restriction_menu = (role: string) => {
  if (role.indexOf("EMPLOYER_") !== -1) {
    return [];
  } else if (role.indexOf("ADMIN_") !== -1) {
    return [
      {
        title: "Add Employé ",
        route: "/home/reserve",
        params: "reserve",
        icon: <ReconciliationTwoTone twoToneColor={colorPrimary} />,
      },
    ];
  } else if (role.indexOf("SUPER_ADMIN") !== -1) {
    return [
      {
        title: "Add Admin ",
        route: "/home/reserve",
        params: "reserve",
        icon: <ReconciliationTwoTone twoToneColor={colorPrimary} />,
      },
      {
        title: "Mobile Payement",
        route: "/home/mobilepayement",
        params: "mobilepayement",
        icon: <ReconciliationTwoTone twoToneColor={colorPrimary} />,
      },
    ];
  } else {
    return [];
  }
};

export default function MenuLeft(props: Props) {
  let params = useParams();
  const role = localStorage.getItem("role") ?? "";
  const name = localStorage.getItem("name") ?? "";
  const indexMenu: string = params["*"] ?? "";
  const avatar =
    role.split("_")[0].substring(0, 1) + role.split("_")[1].substring(0, 1);
  const menuRestruction = restriction_menu(role);
  const [sizeBar, setSizeBar] = useState<number>(180);
  const itemsSidebar = [
    {
      title: "Accueil",
      route: url_dahsbord(role),
      params: params_dahsbord(role),
      icon: <DashboardTwoTone twoToneColor={colorPrimary} />,
    },
    ...menuRestruction,
    {
      title: "Paramêttres",
      route: "/home/setting",
      params: "setting",
      icon: <SettingTwoTone twoToneColor={colorPrimary} />,
    },
    {
      title: "Deconnexion",
      route: "/home/logout",
      params: "logout",
      icon: <ApiTwoTone twoToneColor={colorPrimary} />,
    },
  ];
  const displayMenuTitle = (title: string) => {
    if (sizeBar > 40) return <span>{title}</span>;
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" color="inherit">
      <Toolbar>
        <div className="menuLeft">
          <Avatar className={className([btn_color_primary, shadow_2])}>
            {avatar}
          </Avatar>
          <MegaTitleProps title={name} size="sm" color={colorPrimary} />
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon color="warning" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {itemsSidebar.map((value) => (
                <div
                  className={className([
                    "itemSidebar",
                    indexMenu === value.params
                      ? `shadow_2 border_radius_right ${btn_color_primary}`
                      : "",
                  ])}
                  key={value.title}
                >
                  <Link to={value.route}>
                    <ListItem onClick={handleClose}>
                      <Space>
                        {value.icon}
                        {displayMenuTitle(value.title)}
                      </Space>
                    </ListItem>
                  </Link>
                </div>
              ))}
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
