import { Modal as AntdModal } from 'antd';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean
  closeModal: () => void
  width?: number
  classNames?: {
    header?: string;
    body?: string;
    footer?: string;
    content?: string;
  }
  footer?: ReactNode
  closeIcon?: ReactNode
  afterCloseModal?: () => void
  maskClosable?: boolean
  closable?: boolean
  keyboard?: boolean
  children: ReactNode
}

export function Modal({
  isOpen,
  closeModal,
  width = 640,
  classNames,
  footer = null,
  closeIcon = <X className="size-5 text-zinc-400" />,
  afterCloseModal,
  maskClosable,
  closable,
  keyboard,
  children,
}: ModalProps) {
  function handleOk() {
    closeModal();
  }

  function handleCancel() {
    closeModal();
  }

  const classes = {
    ...classNames,
    content: '!bg-zinc-900 text-zinc-50',
  };

  return (
    <AntdModal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width}
      classNames={classes}
      footer={footer}
      closeIcon={closeIcon}
      maskClosable={maskClosable}
      closable={closable}
      keyboard={keyboard}
      afterClose={afterCloseModal}
      centered
    >
      {children}
    </AntdModal>
  );
}
