import { Modal as AntdModal, ModalProps as AntdModalProps } from 'antd';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

type ModalFooter = Pick<AntdModalProps, 'footer'>

interface ModalProps extends ModalFooter {
  isOpen: boolean
  closeModal: () => void
  width?: number
  classNames?: {
    header?: string;
    body?: string;
    footer?: string;
    content?: string;
  }
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
  closeIcon = <X className="size-6 text-zinc-400" />,
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

  const modalClasses = {
    ...classNames,
    content: `${classNames?.content} !bg-zinc-900 text-zinc-50`,
  };

  return (
    <AntdModal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width}
      classNames={modalClasses}
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
