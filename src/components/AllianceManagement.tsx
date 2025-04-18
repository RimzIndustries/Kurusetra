import React, { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
import { Alliance, AllianceMember, AllianceRank, AllianceWar } from '@types/game';
import AllianceVoting from './AllianceVoting';

interface AllianceManagementProps {
    gameId: string;
    playerId: string;
}

const AllianceManagement: React.FC<AllianceManagementProps> = ({ gameId, playerId }) => {
    const [alliances, setAlliances] = useState<Alliance[]>([]);
    const [members, setMembers] = useState<AllianceMember[]>([]);
    const [ranks, setRanks] = useState<AllianceRank[]>([]);
    const [selectedAlliance, setSelectedAlliance] = useState<string | null>(null);
    const [isLeader, setIsLeader] = useState(false);
    const [activeWars, setActiveWars] = useState<AllianceWar[]>([]);
    const [memberCount, setMemberCount] = useState<number>(0);
    const MAX_MEMBERS = 15;

    useEffect(() => {
        const fetchAllianceData = async () => {
            // Fetch alliances
            const { data: allianceData } = await supabase
                .from('alliances')
                .select('*')
                .eq('game_id', gameId);

            if (allianceData) {
                setAlliances(allianceData);

                // Fetch members
                const { data: memberData } = await supabase
                    .from('alliance_members')
                    .select('*')
                    .in('alliance_id', allianceData.map(a => a.id));

                if (memberData) {
                    setMembers(memberData);
                    setMemberCount(memberData.length);
                    
                    // Check if player is a leader
                    const playerMembership = memberData.find(m => m.player_id === playerId);
                    if (playerMembership) {
                        const { data: rankData } = await supabase
                            .from('alliance_ranks')
                            .select('*')
                            .eq('rank_type', playerMembership.rank_type)
                            .single();

                        if (rankData && rankData.permissions.declare_war) {
                            setIsLeader(true);
                        }
                    }
                }
            }

            // Fetch ranks
            const { data: rankData } = await supabase
                .from('alliance_ranks')
                .select('*');

            if (rankData) {
                setRanks(rankData);
            }

            // Fetch active wars
            const { data: warData } = await supabase
                .from('alliance_wars')
                .select('*')
                .eq('status', 'active');

            if (warData) {
                setActiveWars(warData);
            }
        };

        fetchAllianceData();
        const interval = setInterval(fetchAllianceData, 30000);

        return () => clearInterval(interval);
    }, [gameId, playerId]);

    const handleCreateAlliance = async (name: string) => {
        const { data, error } = await supabase
            .from('alliances')
            .insert([{ game_id: gameId, name }])
            .select()
            .single();

        if (data && !error) {
            // Add creator as leader
            await supabase
                .from('alliance_members')
                .insert([{
                    alliance_id: data.id,
                    player_id: playerId,
                    rank_type: 'leader'
                }]);
        }
    };

    const handleJoinAlliance = async (allianceId: string) => {
        if (memberCount >= MAX_MEMBERS) {
            alert('Aliansi sudah mencapai batas maksimal anggota (15)');
            return;
        }

        await supabase
            .from('alliance_members')
            .insert([{
                alliance_id: allianceId,
                player_id: playerId,
                rank_type: 'member'
            }]);
    };

    const handleKickMember = async (memberId: string) => {
        if (!isLeader) return;

        await supabase
            .from('alliance_members')
            .delete()
            .eq('player_id', memberId)
            .eq('alliance_id', selectedAlliance);
    };

    const handleDeclareWar = async (targetAllianceId: string) => {
        if (!isLeader || !selectedAlliance) return;

        const { data, error } = await supabase
            .rpc('declare_alliance_war', {
                attacker_alliance_id: selectedAlliance,
                defender_alliance_id: targetAllianceId
            });

        if (error) {
            alert('Gagal mendeklarasikan perang: ' + error.message);
        }
    };

    return (
        <div className="alliance-management-container">
            <h2>Manajemen Aliansi</h2>

            {/* Alliance List */}
            <div className="alliance-list">
                <h3>Aliansi yang Tersedia</h3>
                {alliances.map(alliance => (
                    <div key={alliance.id} className="alliance-card">
                        <div className="alliance-header">
                            <span className="alliance-name">{alliance.name}</span>
                            <div className="alliance-actions">
                                {!members.some(m => m.player_id === playerId) && (
                                    <button 
                                        onClick={() => handleJoinAlliance(alliance.id)}
                                        className="join-button"
                                        disabled={memberCount >= MAX_MEMBERS}
                                    >
                                        Bergabung
                                    </button>
                                )}
                                <button 
                                    onClick={() => setSelectedAlliance(alliance.id)}
                                    className="view-details"
                                >
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                        
                        {selectedAlliance === alliance.id && (
                            <div className="alliance-details">
                                <div className="members-list">
                                    <h4>Anggota ({members.filter(m => m.alliance_id === alliance.id).length}/{MAX_MEMBERS})</h4>
                                    {members
                                        .filter(m => m.alliance_id === alliance.id)
                                        .map(member => (
                                            <div key={member.player_id} className="member-item">
                                                <span>{member.player_id}</span>
                                                <span className="rank">{member.rank_type}</span>
                                                {isLeader && member.player_id !== playerId && (
                                                    <button 
                                                        onClick={() => handleKickMember(member.player_id)}
                                                        className="kick-button"
                                                    >
                                                        Keluarkan
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                </div>

                                {/* Voting Section */}
                                <AllianceVoting 
                                    allianceId={alliance.id}
                                    playerId={playerId}
                                />

                                {/* War Section */}
                                {isLeader && (
                                    <div className="war-section">
                                        <h4>Perang Aliansi</h4>
                                        {activeWars
                                            .filter(w => w.attacker_alliance_id === alliance.id || w.defender_alliance_id === alliance.id)
                                            .map(war => (
                                                <div key={war.id} className="war-card">
                                                    <div className="war-info">
                                                        <span>Perang dengan: {
                                                            war.attacker_alliance_id === alliance.id 
                                                                ? alliances.find(a => a.id === war.defender_alliance_id)?.name
                                                                : alliances.find(a => a.id === war.attacker_alliance_id)?.name
                                                        }</span>
                                                        <span>Skor: {war.war_score}</span>
                                                        <span>Berakhir: {new Date(war.end_time).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        
                                        <div className="declare-war">
                                            <h5>Deklarasikan Perang</h5>
                                            <select 
                                                onChange={(e) => handleDeclareWar(e.target.value)}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Pilih Aliansi</option>
                                                {alliances
                                                    .filter(a => a.id !== alliance.id)
                                                    .map(target => (
                                                        <option key={target.id} value={target.id}>
                                                            {target.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Alliance Form */}
            {!members.some(m => m.player_id === playerId) && (
                <div className="create-alliance">
                    <h3>Buat Aliansi Baru</h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target as HTMLFormElement;
                        const name = (form.elements.namedItem('allianceName') as HTMLInputElement).value;
                        handleCreateAlliance(name);
                    }}>
                        <input 
                            type="text" 
                            name="allianceName" 
                            placeholder="Nama Aliansi" 
                            required 
                        />
                        <button type="submit">Buat Aliansi</button>
                    </form>
                </div>
            )}

            <style jsx>{`
                .alliance-management-container {
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 10px;
                    color: white;
                }

                .alliance-card {
                    margin: 10px 0;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                }

                .alliance-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }

                .alliance-name {
                    font-weight: bold;
                    font-size: 1.2em;
                }

                .alliance-actions {
                    display: flex;
                    gap: 10px;
                }

                .join-button, .view-details {
                    padding: 5px 10px;
                    background: #4CAF50;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                }

                .join-button:disabled {
                    background: #666;
                    cursor: not-allowed;
                }

                .member-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px;
                    margin: 5px 0;
                    background: rgba(255, 255, 255, 0.05);
                }

                .rank {
                    color: #aaa;
                }

                .kick-button {
                    padding: 3px 8px;
                    background: #f44336;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                }

                .war-section {
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(255, 0, 0, 0.1);
                    border-radius: 5px;
                }

                .war-card {
                    margin: 10px 0;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }

                .war-info {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .declare-war {
                    margin-top: 15px;
                }

                .declare-war select {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 3px;
                    color: white;
                }

                .create-alliance {
                    margin-top: 20px;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                }

                .create-alliance form {
                    display: flex;
                    gap: 10px;
                }

                .create-alliance input {
                    flex: 1;
                    padding: 8px;
                    border: none;
                    border-radius: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .create-alliance button {
                    padding: 8px 15px;
                    background: #4CAF50;
                    border: none;
                    border-radius: 3px;
                    color: white;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default AllianceManagement; 