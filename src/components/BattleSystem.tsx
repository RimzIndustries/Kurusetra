import React, { useState, useEffect } from 'react';
import { useBattleSystem } from '../hooks/useBattleSystem';
import { useGameState } from '../hooks/useGameState';
import styled, { ThemeProvider, keyframes } from 'styled-components';
import { RaceZodiacInfo } from './RaceZodiacInfo';
import { ZodiacSign } from '../types/game';
import { defaultTheme, darkTheme, raceThemes, GlobalStyle } from '../styles/theme';
import {
  NeumorphicCard,
  NeumorphicButton,
  NeumorphicInput,
  NeumorphicSelect,
  NeumorphicContainer,
  NeumorphicList,
  NeumorphicListItem,
  NeumorphicBadge,
  NeumorphicDivider
} from '../styles/components';

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const glow = keyframes`
  0% { box-shadow: 0 0 5px ${props => props.theme.accent}; }
  50% { box-shadow: 0 0 20px ${props => props.theme.accent}; }
  100% { box-shadow: 0 0 5px ${props => props.theme.accent}; }
`;

const ResourceDisplay = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

const ResourceItem = styled.div`
  background: ${props => props.theme.primary};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

interface BattleResultProps {
  won: boolean;
}

const BattleResult = styled.div<BattleResultProps>`
  margin-top: 2rem;
  padding: 1rem;
  background: ${props => props.theme.primary};
  border-radius: 15px;
  box-shadow: 
    5px 5px 10px ${props => props.theme.shadow},
    -5px -5px 10px ${props => props.theme.light};
  color: ${props => props.won ? props.theme.success : props.theme.error};
  text-align: center;
`;

const AllianceCouncil = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const CouncilMember = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem 0;
  background: ${props => props.theme.primary};
  border-radius: 10px;
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const VoteSection = styled.div`
  margin-top: 1rem;
`;

const VoteOption = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0;
`;

const RaceSelect = styled.select`
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 10px;
  padding: 0.5rem;
  margin: 1rem 0;
  color: ${props => props.theme.text};
  box-shadow: 
    inset 3px 3px 6px ${props => props.theme.shadow},
    inset -3px -3px 6px ${props => props.theme.light};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 
      inset 3px 3px 6px ${props => props.theme.shadow},
      inset -3px -3px 6px ${props => props.theme.light},
      0 0 0 2px ${props => props.theme.accent};
  }
`;

const ThemeToggle = styled(NeumorphicButton)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  border: 3px solid ${props => props.theme.primary};
  border-top: 3px solid ${props => props.theme.accent};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  margin: 0 auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ZodiacSelect = styled(RaceSelect)`
  margin-top: 1rem;
`;

const ZodiacBonusDisplay = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: ${props => props.theme.primary};
  border-radius: 10px;
  box-shadow: 
    3px 3px 6px ${props => props.theme.shadow},
    -3px -3px 6px ${props => props.theme.light};
`;

const BattleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BattleTitle = styled.h1`
  color: ${props => props.theme.accent};
  font-size: 2.5rem;
  margin: 0;
`;

const BattleControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const BattleStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`;

const StatCard = styled(NeumorphicCard)`
  text-align: center;
  padding: 1.5rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.accent};
  margin: 0.5rem 0;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const BattleActions = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const ActionButton = styled(NeumorphicButton)`
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  padding: 1rem 2rem;

  &:hover {
    transform: translateY(-3px);
    background: ${props => props.theme.accent};
    color: white;
  }
`;

const BattleLog = styled(NeumorphicCard)`
  margin-top: 2rem;
  max-height: 300px;
  overflow-y: auto;
`;

const LogEntry = styled.div`
  padding: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.secondary};
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:last-child {
    border-bottom: none;
  }
`;

interface BattleResult {
  winner: string;
  loser: string;
  score: number;
  resourcesGained: {
    gold: number;
    wood: number;
    stone: number;
    food: number;
  };
  unitsLost: {
    attacker: number;
    defender: number;
  };
}

export const BattleSystem: React.FC = () => {
  const { gameState } = useGameState();
  const {
    battleResult,
    allianceCouncil,
    processBattle,
    fetchAllianceCouncil,
    startVote,
    castVote,
  } = useBattleSystem();

  const [selectedOpponent, setSelectedOpponent] = useState<string>('');
  const [selectedVote, setSelectedVote] = useState<string>('');
  const [selectedRace, setSelectedRace] = useState<string>(gameState.player.race || 'ksatriya');
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacSign>(gameState.player.zodiac || 'aries');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    // Load saved theme preferences
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const { race, darkMode } = JSON.parse(savedTheme);
      setSelectedRace(race);
      setIsDarkMode(darkMode);
    }
  }, []);

  const handleBattle = async () => {
    if (selectedOpponent) {
      setIsLoading(true);
      try {
        await processBattle(selectedOpponent);
        if (battleResult) {
          setBattleLog(prev => [
            `Battle against ${selectedOpponent} - ${battleResult.winner === gameState.player.id ? 'Victory!' : 'Defeat!'}`,
            ...prev
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAllianceCouncil = async () => {
    setIsLoading(true);
    try {
      await fetchAllianceCouncil(gameState.player.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (voteId: string, vote: 'yes' | 'no') => {
    setIsLoading(true);
    try {
      await castVote(voteId, gameState.player.id, vote);
      setBattleLog(prev => [
        `Voted ${vote} on proposal ${voteId}`,
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRaceChange = (race: string) => {
    setSelectedRace(race);
    localStorage.setItem('theme', JSON.stringify({ 
      race, 
      zodiac: selectedZodiac,
      darkMode: isDarkMode 
    }));
  };

  const handleZodiacChange = (zodiac: ZodiacSign) => {
    setSelectedZodiac(zodiac);
    localStorage.setItem('theme', JSON.stringify({ 
      race: selectedRace, 
      zodiac,
      darkMode: isDarkMode 
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', JSON.stringify({ 
      race: selectedRace, 
      zodiac: selectedZodiac,
      darkMode: !isDarkMode 
    }));
  };

  const getCurrentTheme = () => {
    if (!gameState.player.id) {
      return defaultTheme;
    }
    return raceThemes[selectedRace][isDarkMode ? 'dark' : 'light'];
  };

  const getZodiacBonuses = (zodiac: ZodiacSign) => {
    switch (zodiac) {
      case 'aries':
        return {
          firstStrikeSpeed: 0.4,
          initialMorale: 1.5,
          canConquerFast: true
        };
      case 'taurus':
        return {
          resourceProduction: 0.5,
          defenseBonus: 0.3,
          economicStrength: 1.5
        };
      case 'gemini':
        return {
          canBuildTwoStructures: true,
          canTrainTwoUnits: true,
          diplomacyFlexibility: 1.5
        };
      case 'cancer':
        return {
          homeDefense: 0.35,
          troopRegeneration: 1.5,
          psychologicalWarfare: true
        };
      case 'leo':
        return {
          leadershipBonus: 0.25,
          allianceMorale: 1.5,
          spectacularAttacks: true
        };
      case 'virgo':
        return {
          researchSpeed: 0.4,
          resourceEfficiency: 1.5,
          highPrecisionUnits: true
        };
      case 'libra':
        return {
          canStealBalanced: true,
          diplomacyBonus: 0.3,
          warBalancer: true
        };
      case 'scorpio':
        return {
          covertOpsEfficiency: 0.5,
          deadlyCounterattacks: true,
          asymmetricWarfare: true
        };
      case 'sagittarius':
        return {
          rangedAccuracy: 0.5,
          mapExploration: 2,
          scoutingBonus: true
        };
      case 'capricorn':
        return {
          mountainConstruction: 0.6,
          roughTerrainStrength: 1.5,
          geographicExpansion: true
        };
      case 'aquarius':
        return {
          innovativeResearch: true,
          weatherAdaptation: true,
          uniqueWeapons: true
        };
      case 'pisces':
        return {
          resourceRegeneration: true,
          magicalIllusions: true,
          sustainableEconomy: true
        };
    }
  };

  return (
    <ThemeProvider theme={getCurrentTheme()}>
      <GlobalStyle />
      <NeumorphicContainer>
        <BattleHeader>
          <BattleTitle>Battle System</BattleTitle>
          <BattleControls>
            <NeumorphicButton onClick={toggleDarkMode}>
              {isDarkMode ? '🌞' : '🌙'}
            </NeumorphicButton>
          </BattleControls>
        </BattleHeader>

        {gameState.player.id ? (
          <>
            <RaceZodiacInfo race={selectedRace} zodiac={selectedZodiac} />

            <BattleStats>
              <StatCard>
                <StatLabel>Attack Power</StatLabel>
                <StatValue>{gameState.player.attack}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Defense</StatLabel>
                <StatValue>{gameState.player.defense}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Health</StatLabel>
                <StatValue>{gameState.player.health}/{gameState.player.maxHealth}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Influence</StatLabel>
                <StatValue>{gameState.player.influence}</StatValue>
              </StatCard>
            </BattleStats>

            <BattleActions>
              <ActionButton onClick={handleBattle} primary disabled={isLoading}>
                {isLoading ? 'Loading...' : '⚔️ Start Battle'}
              </ActionButton>
              <ActionButton onClick={handleAllianceCouncil} disabled={isLoading}>
                {isLoading ? 'Loading...' : '🤝 Alliance Council'}
              </ActionButton>
            </BattleActions>

            <BattleLog>
              <h3>Battle Log</h3>
              {battleLog.map((entry, index) => (
                <LogEntry key={index}>{entry}</LogEntry>
              ))}
            </BattleLog>
          </>
        ) : (
          <NeumorphicCard>
            <h2>Please Login</h2>
            <p>You need to be logged in to access the battle system.</p>
          </NeumorphicCard>
        )}
      </NeumorphicContainer>
    </ThemeProvider>
  );
}; 