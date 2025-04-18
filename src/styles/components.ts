import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px ${props => props.theme.accent}; }
  50% { box-shadow: 0 0 20px ${props => props.theme.accent}; }
  100% { box-shadow: 0 0 5px ${props => props.theme.accent}; }
`;

export const NeumorphicCard = styled.div`
  background: ${props => props.theme.primary};
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem 0;
  box-shadow: 
    9px 9px 16px ${props => props.theme.shadow},
    -9px -9px 16px ${props => props.theme.light};
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const NeumorphicButton = styled.button<{ primary?: boolean; glow?: boolean }>`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    5px 5px 10px ${props => props.theme.shadow},
    -5px -5px 10px ${props => props.theme.light};

  ${props => props.primary && css`
    background: ${props.theme.accent};
    color: white;
  `}

  ${props => props.glow && css`
    animation: ${glow} 2s infinite;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      7px 7px 14px ${props => props.theme.shadow},
      -7px -7px 14px ${props => props.theme.light};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const NeumorphicInput = styled.input`
  background: ${props => props.theme.primary};
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  color: ${props => props.theme.text};
  font-size: 1rem;
  box-shadow: 
    inset 5px 5px 10px ${props => props.theme.shadow},
    inset -5px -5px 10px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 
      inset 5px 5px 10px ${props => props.theme.shadow},
      inset -5px -5px 10px ${props => props.theme.light},
      0 0 0 2px ${props => props.theme.accent};
  }
`;

export const NeumorphicSelect = styled.select`
  background: ${props => props.theme.primary};
  border-radius: 10px;
  padding: 0.8rem 1.5rem;
  color: ${props => props.theme.text};
  font-size: 1rem;
  box-shadow: 
    inset 5px 5px 10px ${props => props.theme.shadow},
    inset -5px -5px 10px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:focus {
    box-shadow: 
      inset 5px 5px 10px ${props => props.theme.shadow},
      inset -5px -5px 10px ${props => props.theme.light},
      0 0 0 2px ${props => props.theme.accent};
  }
`;

export const NeumorphicContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.primary};
  min-height: 100vh;
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
`;

export const NeumorphicList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NeumorphicListItem = styled.li`
  background: ${props => props.theme.primary};
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 
    5px 5px 10px ${props => props.theme.shadow},
    -5px -5px 10px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
  }
`;

export const NeumorphicBadge = styled.span<{ type?: 'success' | 'error' | 'warning' | 'info' }>`
  background: ${props => props.theme.primary};
  border-radius: 15px;
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};

  ${props => props.type && css`
    color: white;
    background: ${props.theme[props.type]};
  `}
`;

export const NeumorphicDivider = styled.hr`
  border: none;
  height: 1px;
  background: ${props => props.theme.primary};
  box-shadow: 
    0 1px 2px ${props => props.theme.shadow},
    0 -1px 2px ${props => props.theme.light};
  margin: 1rem 0;
`;

export const NeumorphicProgress = styled.div<{ value: number }>`
  width: 100%;
  height: 10px;
  background: ${props => props.theme.primary};
  border-radius: 5px;
  box-shadow: 
    inset 3px 3px 6px ${props => props.theme.shadow},
    inset -3px -3px 6px ${props => props.theme.light};
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.value}%;
    background: ${props => props.theme.accent};
    border-radius: 5px;
    transition: width 0.3s ease;
  }
`; 