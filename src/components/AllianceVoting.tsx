import React, { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
import { AllianceMember, AllianceVote } from '@types/game';

interface AllianceVotingProps {
    allianceId: string;
    playerId: string;
}

const AllianceVoting: React.FC<AllianceVotingProps> = ({ allianceId, playerId }) => {
    const [members, setMembers] = useState<AllianceMember[]>([]);
    const [votes, setVotes] = useState<AllianceVote[]>([]);
    const [currentVote, setCurrentVote] = useState<string | null>(null);
    const [votingEndTime, setVotingEndTime] = useState<Date | null>(null);
    const [isVotingActive, setIsVotingActive] = useState(false);

    useEffect(() => {
        const fetchVotingData = async () => {
            // Fetch members
            const { data: memberData } = await supabase
                .from('alliance_members')
                .select('*')
                .eq('alliance_id', allianceId);

            if (memberData) {
                setMembers(memberData);
            }

            // Fetch active voting session
            const { data: votingData } = await supabase
                .from('alliance_votes')
                .select('*')
                .eq('alliance_id', allianceId)
                .eq('status', 'active')
                .single();

            if (votingData) {
                setVotingEndTime(new Date(votingData.end_time));
                setIsVotingActive(true);
                
                // Fetch votes for this session
                const { data: voteData } = await supabase
                    .from('alliance_vote_records')
                    .select('*')
                    .eq('voting_session_id', votingData.id);

                if (voteData) {
                    setVotes(voteData);
                    const playerVote = voteData.find(v => v.voter_id === playerId);
                    if (playerVote) {
                        setCurrentVote(playerVote.candidate_id);
                    }
                }
            }
        };

        fetchVotingData();
        const interval = setInterval(fetchVotingData, 30000);

        return () => clearInterval(interval);
    }, [allianceId, playerId]);

    const handleVote = async (candidateId: string) => {
        if (!isVotingActive) return;

        const { data: votingSession } = await supabase
            .from('alliance_votes')
            .select('*')
            .eq('alliance_id', allianceId)
            .eq('status', 'active')
            .single();

        if (!votingSession) return;

        await supabase
            .from('alliance_vote_records')
            .upsert([{
                voting_session_id: votingSession.id,
                voter_id: playerId,
                candidate_id: candidateId,
                voted_at: new Date().toISOString()
            }]);

        setCurrentVote(candidateId);
    };

    const startNewVoting = async () => {
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 1); // Voting berlangsung selama 24 jam

        const { data: votingSession } = await supabase
            .from('alliance_votes')
            .insert([{
                alliance_id: allianceId,
                start_time: new Date().toISOString(),
                end_time: endTime.toISOString(),
                status: 'active'
            }])
            .select()
            .single();

        if (votingSession) {
            setVotingEndTime(endTime);
            setIsVotingActive(true);
        }
    };

    return (
        <div className="alliance-voting-container">
            <h2>Pemilihan Pemimpin Aliansi</h2>

            {isVotingActive && votingEndTime && (
                <div className="voting-status">
                    <p>Pemilihan berlangsung hingga: {votingEndTime.toLocaleString()}</p>
                    <div className="time-remaining">
                        {Math.max(0, Math.floor((votingEndTime.getTime() - new Date().getTime()) / 1000 / 60))} menit tersisa
                    </div>
                </div>
            )}

            <div className="candidates-list">
                {members.map(member => (
                    <div key={member.player_id} className="candidate-card">
                        <div className="candidate-info">
                            <span className="candidate-name">{member.player_id}</span>
                            <span className="vote-count">
                                {votes.filter(v => v.candidate_id === member.player_id).length} suara
                            </span>
                        </div>
                        <button
                            onClick={() => handleVote(member.player_id)}
                            disabled={!isVotingActive || currentVote === member.player_id}
                            className={`vote-button ${currentVote === member.player_id ? 'voted' : ''}`}
                        >
                            {currentVote === member.player_id ? 'Sudah Memilih' : 'Pilih'}
                        </button>
                    </div>
                ))}
            </div>

            {!isVotingActive && (
                <button onClick={startNewVoting} className="start-voting">
                    Mulai Pemilihan Baru
                </button>
            )}

            <style jsx>{`
                .alliance-voting-container {
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 10px;
                    color: white;
                }

                .voting-status {
                    margin-bottom: 20px;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                }

                .time-remaining {
                    font-size: 1.2em;
                    font-weight: bold;
                    color: #4CAF50;
                }

                .candidates-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .candidate-card {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                }

                .candidate-info {
                    display: flex;
                    flex-direction: column;
                }

                .candidate-name {
                    font-weight: bold;
                }

                .vote-count {
                    color: #aaa;
                    font-size: 0.9em;
                }

                .vote-button {
                    padding: 8px 15px;
                    background: #4CAF50;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                }

                .vote-button:disabled {
                    background: #666;
                    cursor: not-allowed;
                }

                .vote-button.voted {
                    background: #2196F3;
                }

                .start-voting {
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #FF9800;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default AllianceVoting; 