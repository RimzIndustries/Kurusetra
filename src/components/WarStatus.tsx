import React, { useEffect, useState } from 'react';
import { supabase } from '@utils/supabase';
import { War, WarParticipant, WarEvent } from '@types/game';

interface WarStatusProps {
    gameId: string;
    playerId: string;
}

const WarStatus: React.FC<WarStatusProps> = ({ gameId, playerId }) => {
    const [activeWars, setActiveWars] = useState<War[]>([]);
    const [warParticipants, setWarParticipants] = useState<WarParticipant[]>([]);
    const [recentEvents, setRecentEvents] = useState<WarEvent[]>([]);

    useEffect(() => {
        const fetchWarData = async () => {
            // Fetch active wars
            const { data: wars } = await supabase
                .from('wars')
                .select('*')
                .eq('game_id', gameId)
                .eq('status', 'active');

            if (wars) {
                setActiveWars(wars);

                // Fetch participants for each war
                const { data: participants } = await supabase
                    .from('war_participants')
                    .select('*')
                    .in('war_id', wars.map(w => w.id));

                if (participants) {
                    setWarParticipants(participants);
                }

                // Fetch recent events
                const { data: events } = await supabase
                    .from('war_events')
                    .select('*')
                    .in('war_id', wars.map(w => w.id))
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (events) {
                    setRecentEvents(events);
                }
            }
        };

        fetchWarData();
        const interval = setInterval(fetchWarData, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [gameId]);

    return (
        <div className="war-status-container">
            <h2>Status Perang</h2>
            
            {/* Active Wars Section */}
            <div className="active-wars">
                <h3>Perang Aktif</h3>
                {activeWars.map(war => (
                    <div key={war.id} className="war-card">
                        <div className="war-header">
                            <span className="war-type">{war.war_type === 'player_war' ? 'Perang Pemain' : 'Perang Aliansi'}</span>
                            <span className="war-score">Skor: {war.war_score}</span>
                        </div>
                        <div className="war-participants">
                            <div className="attacker">
                                <span>Penyerang:</span>
                                {warParticipants
                                    .filter(p => p.war_id === war.id && p.side === 'attacker')
                                    .map(p => (
                                        <span key={p.participant_id}>{p.participant_type}</span>
                                    ))}
                            </div>
                            <div className="defender">
                                <span>Bertahan:</span>
                                {warParticipants
                                    .filter(p => p.war_id === war.id && p.side === 'defender')
                                    .map(p => (
                                        <span key={p.participant_id}>{p.participant_type}</span>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Events Section */}
            <div className="recent-events">
                <h3>Kejadian Terkini</h3>
                {recentEvents.map(event => (
                    <div key={event.id} className="event-card">
                        <span className="event-type">{event.event_type}</span>
                        <span className="event-location">({event.location_x}, {event.location_y})</span>
                        <div className="event-details">
                            {JSON.stringify(event.event_data)}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .war-status-container {
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    border-radius: 10px;
                    color: white;
                }

                .war-card {
                    margin: 10px 0;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                }

                .war-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .war-participants {
                    display: flex;
                    justify-content: space-between;
                }

                .event-card {
                    margin: 10px 0;
                    padding: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 5px;
                }

                .event-type {
                    font-weight: bold;
                    margin-right: 10px;
                }

                .event-location {
                    color: #aaa;
                }

                .event-details {
                    margin-top: 5px;
                    font-size: 0.9em;
                }
            `}</style>
        </div>
    );
};

export default WarStatus; 