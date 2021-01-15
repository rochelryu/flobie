import React from 'react';
import {Avatar, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { ApiTwoTone, DashboardTwoTone, SettingTwoTone, ReconciliationTwoTone } from '@ant-design/icons';
import { colorPrimary } from '../../../Constants/color';
import './MenuLeft.scss'
import { btn_color_primary, shadow_2 } from '../../../Constants/ClassName/Buttons';
import { className } from '../../../Constants/function';
interface Props {
  url? :string
}

  export default function MenuLeft(props: Props) {
  console.log(props.url)
  const itemsSidebar = [
    {
        title: "Accueil",
        route: "/home",
        icon: <DashboardTwoTone twoToneColor={colorPrimary} />,
    },
    {
      title: "Reservation",
      route: "/home/reserve",
      icon: <ReconciliationTwoTone twoToneColor={colorPrimary}/>,
    },
    {
      title: "Paramêttres",
      route: "/home/setting",
      icon: <SettingTwoTone twoToneColor={colorPrimary} />,
    },
    {
      title: "Deconexion",
      route: "/home/logout",
      icon: <ApiTwoTone twoToneColor={colorPrimary} />
    }

]

  return (
    <div className='menuLeft'>
      <ListItem className="mv3 mh2">
        <ListItemIcon><Avatar className={className([btn_color_primary, shadow_2])}>H</Avatar></ListItemIcon>
        <ListItemText primary={"Ibis"} />
      </ListItem>
        <List>
          {itemsSidebar.map((value, index) => (
            <div className={className(["itemSidebar", index === 0 ? `shadow_2 border_radius_right ${btn_color_primary}` : ""])} key={value.title}>
              <Link to={value.route}>
              <ListItem>
                  <ListItemIcon>{value.icon}</ListItemIcon>
                  <span>{value.title}</span>
              </ListItem>
            </Link>
            </div>
          ))}
        </List>
        
    </div>
  );
}
