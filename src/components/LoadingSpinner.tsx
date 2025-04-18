import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const SpinnerContainer = styled(motion.div)<{ size: 'sm' | 'md' | 'lg' }>`
  width: ${props => {
    switch (props.size) {
      case 'sm': return '1.5rem';
      case 'md': return '2rem';
      case 'lg': return '3rem';
      default: return '2rem';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'sm': return '1.5rem';
      case 'md': return '2rem';
      case 'lg': return '3rem';
      default: return '2rem';
    }
  }};
  border: 4px solid ${props => props.theme.accent};
  border-radius: 50%;
  box-shadow: 
    5px 5px 10px ${props => props.theme.shadow},
    -5px -5px 10px ${props => props.theme.light};
`;

const LoadingText = styled(motion.p)<{ size: 'sm' | 'md' | 'lg' }>`
  color: ${props => props.theme.text};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  text-shadow: 
    1px 1px 2px ${props => props.theme.shadow},
    -1px -1px 2px ${props => props.theme.light};
`;

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...' 
}) => {
  return (
    <Container>
      <SpinnerContainer
        size={size}
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          borderTopColor: 'transparent'
        }}
      />
      <LoadingText 
        size={size}
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {text}
      </LoadingText>
    </Container>
  );
};

export default LoadingSpinner; 