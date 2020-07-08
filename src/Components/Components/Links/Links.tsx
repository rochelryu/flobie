import React from 'react'
import { Tooltip } from '@material-ui/core'
import { Props } from '../../../Interfaces/Props/LinksProps';
import { Link } from 'react-router-dom';
import { color_primary } from '../../../Constants/ClassName/Color';


export default function Links(props: Props) {
    if(props.tooltip) {
        return (
            <Tooltip title={props.tooltip}>
               <Link className={color_primary} to={props.to}>{props.content}</Link> 
            </Tooltip>
        )
    }
    else {
        return (
               <Link className={color_primary} to={props.to}>{props.content}</Link> 
        )
    }
}