import React from 'react'
import { Button, Tooltip } from 'antd';
import { Props } from '../../../Interfaces/Props/ButtonsProps'



export default function Buttons(props: Props) {
    const buttonRef = React.createRef<HTMLElement>();
    // const HeartIcon = (props: any) => <Icon component={props.icon} {...props} />;
    if(props.tooltip) {
    return(
            <Tooltip title={props.tooltip}>
                <Button
                    id={props.id}
                    ref={buttonRef}
                    className={props.className}
                    type={props.type}
                    shape={props.shape}
                    disabled={props.disabled ?? false}
                    danger={props.danger ?? false}
                    loading={props.loading ?? false}
                    block={props.block ?? false}
                    onClick={props.onClick}
                    onFocus={props.onFocus}
                    onBlur={props.onBlur}
                    icon={props.icon}>
                        {props.title ?? ''}
                </Button>
            </Tooltip> );
    } else {
        return(
            <Button
                id={props.id}
                className={props.className}
                type={props.type}
                shape={props.shape ?? 'circle'}
                disabled={props.disabled ?? false}
                loading={props.loading ?? false}
                block={props.block ?? false}
                onClick={props.onClick}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                icon={props.icon}>
                    {props.title ?? ''}
            </Button>)
        }
        
}