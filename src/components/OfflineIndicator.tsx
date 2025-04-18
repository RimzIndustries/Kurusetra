import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useOfflineSupport } from '../hooks/useOfflineSupport';

const IndicatorContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${props => props.theme.warning};
  color: white;
  padding: 1rem;
  z-index: 50;
  box-shadow: 
    0 5px 10px ${props => props.theme.shadow},
    0 -2px 5px ${props => props.theme.light};
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WarningIcon = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  filter: drop-shadow(1px 1px 2px ${props => props.theme.shadow});
`;

const StatusIndicator = styled(motion.div)`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: white;
  box-shadow: 
    2px 2px 4px ${props => props.theme.shadow},
    -2px -2px 4px ${props => props.theme.light};
`;

export const OfflineIndicator: React.FC = () => {
  const { isOffline } = useOfflineSupport();

  return (
    <AnimatePresence>
      {isOffline && (
        <IndicatorContainer
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
        >
          <ContentContainer>
            <MessageContainer>
              <WarningIcon
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </WarningIcon>
              <span>You are offline. Changes will sync when you're back online.</span>
            </MessageContainer>
            <StatusIndicator
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </ContentContainer>
        </IndicatorContainer>
      )}
    </AnimatePresence>
  );
};

export default React.memo(OfflineIndicator); 