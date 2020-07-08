import React from 'react'
import { Modal } from 'antd';

interface Props {
    loading: boolean
    visible: boolean
    title: string
    handleOk: () => void
    handleCancel: () => void
    footer: React.ReactNode[]
    childreen: React.ReactNode
}

export default function Modals(props: Props) {

    return (
      <div>
        <Modal
          visible={props.visible}
          title={props.title}
          onOk={props.handleOk}
          onCancel={props.handleCancel}
          footer={props.footer}
        >
          {props.childreen}
        </Modal>
      </div>
    );
  }

