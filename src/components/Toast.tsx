import { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { Toast as ToastType } from '../hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div<{ type: ToastType['type'] }>`
  background: ${props => {
    switch (props.type) {
      case 'success':
        return props.theme.success;
      case 'error':
        return props.theme.error;
      case 'warning':
        return props.theme.warning;
      case 'info':
        return props.theme.info;
      default:
        return props.theme.primary;
    }
  }};
  color: white;
  padding: 1rem;
  border-radius: 15px;
  margin-bottom: 0.5rem;
  min-width: 300px;
  max-width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 
    5px 5px 10px ${props => props.theme.shadow},
    -5px -5px 10px ${props => props.theme.light};
  animation: ${slideIn} 0.3s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-5px);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

export const Toast = ({ toast, onClose }: ToastProps) => {
  const handleClose = useCallback(() => {
    onClose(toast.id);
  }, [toast.id, onClose]);

  return (
    <ToastContainer type={toast.type}>
      <span>{toast.message}</span>
      <CloseButton onClick={handleClose}>×</CloseButton>
    </ToastContainer>
  );
}; 