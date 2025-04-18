import { useState, useCallback } from 'react';
import { useGameState } from './useGameState';
import { useToast } from './useToast';
import { supabase } from '../utils/supabase';

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

interface AllianceCouncil {
  id: string;
  allianceId: string;
  members: {
    playerId: string;
    role: 'king' | 'general' | 'advisor' | 'member';
    votePower: number;
  }[];
  currentVotes: {
    id: string;
    type: 'war' | 'policy' | 'member';
    target: string;
    votes: {
      playerId: string;
      vote: 'yes' | 'no';
    }[];
    endTime: Date;
  }[];
}

export const useBattleSystem = () => {
  const { gameState, updatePlayerStats, setBattleState } = useGameState();
  const { addToast } = useToast();
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [allianceCouncil, setAllianceCouncil] = useState<AllianceCouncil | null>(null);

  // Calculate battle power
  const calculateBattlePower = useCallback((units: any[]) => {
    return units.reduce((total, unit) => {
      return total + (unit.count * (unit.stats.attack + unit.stats.defense));
    }, 0);
  }, []);

  // Process PVP battle
  const processBattle = useCallback(async (opponentId: string) => {
    try {
      setBattleState(true);
      
      // Fetch opponent data
      const { data: opponent, error: opponentError } = await supabase
        .from('players')
        .select('*')
        .eq('id', opponentId)
        .single();

      if (opponentError) throw opponentError;

      const attackerPower = calculateBattlePower(gameState.player.militaryUnits);
      const defenderPower = calculateBattlePower(opponent.militaryUnits);

      // Calculate battle outcome
      const totalPower = attackerPower + defenderPower;
      const attackerWinChance = attackerPower / totalPower;
      const isAttackerWin = Math.random() < attackerWinChance;

      // Calculate losses
      const calculateLosses = (power: number, totalPower: number) => {
        const lossPercentage = (1 - (power / totalPower)) * 0.5;
        return Math.floor(power * lossPercentage);
      };

      const attackerLosses = calculateLosses(attackerPower, totalPower);
      const defenderLosses = calculateLosses(defenderPower, totalPower);

      // Calculate resources gained
      const resourcesGained = {
        gold: Math.floor(opponent.resources.gold * 0.1),
        wood: Math.floor(opponent.resources.wood * 0.1),
        stone: Math.floor(opponent.resources.stone * 0.1),
        food: Math.floor(opponent.resources.food * 0.1),
      };

      const result: BattleResult = {
        winner: isAttackerWin ? gameState.player.id : opponentId,
        loser: isAttackerWin ? opponentId : gameState.player.id,
        score: Math.abs(attackerPower - defenderPower),
        resourcesGained,
        unitsLost: {
          attacker: attackerLosses,
          defender: defenderLosses,
        },
      };

      setBattleResult(result);

      // Update player stats
      if (isAttackerWin) {
        updatePlayerStats({
          resources: {
            ...gameState.player.resources,
            gold: gameState.player.resources.gold + resourcesGained.gold,
            wood: gameState.player.resources.wood + resourcesGained.wood,
            stone: gameState.player.resources.stone + resourcesGained.stone,
            food: gameState.player.resources.food + resourcesGained.food,
          },
        });
      }

      addToast({
        message: isAttackerWin ? 'Battle won!' : 'Battle lost!',
        type: isAttackerWin ? 'success' : 'error',
      });

    } catch (error) {
      console.error('Battle error:', error);
      addToast({
        message: 'Battle failed!',
        type: 'error',
      });
    } finally {
      setBattleState(false);
    }
  }, [gameState, calculateBattlePower, setBattleState, updatePlayerStats, addToast]);

  // Alliance council functions
  const fetchAllianceCouncil = useCallback(async (allianceId: string) => {
    try {
      const { data, error } = await supabase
        .from('alliance_council')
        .select('*')
        .eq('alliance_id', allianceId)
        .single();

      if (error) throw error;
      setAllianceCouncil(data);
    } catch (error) {
      console.error('Error fetching alliance council:', error);
    }
  }, []);

  const startVote = useCallback(async (
    allianceId: string,
    voteType: 'war' | 'policy' | 'member',
    target: string
  ) => {
    try {
      const { error } = await supabase
        .from('alliance_votes')
        .insert({
          alliance_id: allianceId,
          type: voteType,
          target,
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

      if (error) throw error;

      addToast({
        message: 'Vote started successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error starting vote:', error);
      addToast({
        message: 'Failed to start vote!',
        type: 'error',
      });
    }
  }, [addToast]);

  const castVote = useCallback(async (
    voteId: string,
    playerId: string,
    vote: 'yes' | 'no'
  ) => {
    try {
      const { error } = await supabase
        .from('alliance_vote_records')
        .insert({
          vote_id: voteId,
          player_id: playerId,
          vote,
        });

      if (error) throw error;

      addToast({
        message: 'Vote cast successfully!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error casting vote:', error);
      addToast({
        message: 'Failed to cast vote!',
        type: 'error',
      });
    }
  }, [addToast]);

  return {
    battleResult,
    allianceCouncil,
    processBattle,
    fetchAllianceCouncil,
    startVote,
    castVote,
  };
}; 