import { Modal as AntdModal } from 'antd';
import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean
  closeModal: () => void
  width: number
  classNames: {
    header?: string;
    body?: string;
    footer?: string;
    content?: string;
  }
  footer?: ReactNode
  closeIcon: ReactNode
  children: ReactNode
}

export function Modal({
  isOpen,
  closeModal,
  width,
  classNames,
  footer = null,
  closeIcon,
  children,
}: ModalProps) {
  function handleOk() {
    closeModal();
  }

  function handleCancel() {
    closeModal();
  }

  return (
    <AntdModal
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={width}
      classNames={classNames}
      footer={footer}
      closeIcon={closeIcon}
    >
      {children}
    </AntdModal>
  );
}
