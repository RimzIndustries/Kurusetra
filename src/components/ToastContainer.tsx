import React from 'react';
import styled from 'styled-components';
import { useToast } from '../hooks/useToast';
import { Toast } from './Toast';

const Container = styled.div`
  position: fixed;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <Container>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </Container>
  );
}; 