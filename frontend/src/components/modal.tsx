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
  children: ReactNode
}

export function Modal({
  isOpen,
  closeModal,
  width = 640,
  classNames = { content: '!bg-zinc-900' },
  footer = null,
  closeIcon = <X className="size-5 text-zinc-400" />,
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
