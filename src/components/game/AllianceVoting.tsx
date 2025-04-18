import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Users,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { NeumorphicCard, NeumorphicButton, NeumorphicBadge, NeumorphicProgress } from '@/styles/components';

interface VoteProposal {
  id: string;
  title: string;
  description: string;
  type: 'War' | 'Alliance' | 'Resource' | 'Member';
  creator: string;
  createdAt: string;
  endsAt: string;
  votes: {
    yes: number;
    no: number;
    abstain: number;
  };
  status: 'Active' | 'Passed' | 'Failed';
  userVote?: 'yes' | 'no' | 'abstain';
}

const AllianceVoting = () => {
  const [activeProposals, setActiveProposals] = useState<VoteProposal[]>([
    {
      id: "1",
      title: "Declare War on Dark Alliance",
      description: "Proposal to declare war on the Dark Alliance for their recent attacks on our members.",
      type: "War",
      creator: "King Arthur",
      createdAt: "2h ago",
      endsAt: "22h remaining",
      votes: {
        yes: 15,
        no: 5,
        abstain: 3
      },
      status: "Active"
    },
    {
      id: "2",
      title: "Increase Resource Tax",
      description: "Proposal to increase the resource tax from 10% to 15% to fund alliance upgrades.",
      type: "Resource",
      creator: "Queen Guinevere",
      createdAt: "5h ago",
      endsAt: "19h remaining",
      votes: {
        yes: 8,
        no: 12,
        abstain: 3
      },
      status: "Active"
    }
  ]);

  const handleVote = (proposalId: string, vote: 'yes' | 'no' | 'abstain') => {
    setActiveProposals(prev => 
      prev.map(proposal => 
        proposal.id === proposalId 
          ? { ...proposal, userVote: vote }
          : proposal
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Votes */}
      <NeumorphicCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Active Votes</h2>
          <NeumorphicButton>
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </NeumorphicButton>
        </div>

        <div className="space-y-4">
          {activeProposals.map((proposal) => (
            <NeumorphicCard key={proposal.id} className="p-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{proposal.title}</h3>
                    <NeumorphicBadge type={
                      proposal.type === 'War' ? 'error' : 
                      proposal.type === 'Alliance' ? 'info' :
                      proposal.type === 'Resource' ? 'warning' : 'success'
                    }>
                      {proposal.type}
                    </NeumorphicBadge>
                  </div>
                  <p className="text-muted-foreground mb-3">{proposal.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {proposal.creator}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {proposal.endsAt}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Yes</span>
                      <span className="font-medium">{proposal.votes.yes}</span>
                    </div>
                    <NeumorphicProgress 
                      value={(proposal.votes.yes / (proposal.votes.yes + proposal.votes.no + proposal.votes.abstain)) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">No</span>
                      <span className="font-medium">{proposal.votes.no}</span>
                    </div>
                    <NeumorphicProgress 
                      value={(proposal.votes.no / (proposal.votes.yes + proposal.votes.no + proposal.votes.abstain)) * 100}
                      className="h-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Abstain</span>
                      <span className="font-medium">{proposal.votes.abstain}</span>
                    </div>
                    <NeumorphicProgress 
                      value={(proposal.votes.abstain / (proposal.votes.yes + proposal.votes.no + proposal.votes.abstain)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <NeumorphicButton 
                  className="flex-1"
                  onClick={() => handleVote(proposal.id, 'yes')}
                  disabled={proposal.userVote === 'yes'}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Yes
                </NeumorphicButton>
                <NeumorphicButton 
                  className="flex-1"
                  onClick={() => handleVote(proposal.id, 'no')}
                  disabled={proposal.userVote === 'no'}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  No
                </NeumorphicButton>
                <NeumorphicButton 
                  className="flex-1"
                  onClick={() => handleVote(proposal.id, 'abstain')}
                  disabled={proposal.userVote === 'abstain'}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Abstain
                </NeumorphicButton>
              </div>
            </NeumorphicCard>
          ))}
        </div>
      </NeumorphicCard>

      {/* Voting History */}
      <NeumorphicCard className="p-6">
        <h2 className="text-2xl font-bold mb-6">Voting History</h2>
        <div className="space-y-4">
          <NeumorphicCard className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Accept New Member: Sir Galahad</h3>
                <p className="text-sm text-muted-foreground">3 days ago</p>
              </div>
              <NeumorphicBadge type="success">
                Passed
              </NeumorphicBadge>
            </div>
          </NeumorphicCard>
          <NeumorphicCard className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Increase Military Training</h3>
                <p className="text-sm text-muted-foreground">1 week ago</p>
              </div>
              <NeumorphicBadge type="error">
                Failed
              </NeumorphicBadge>
            </div>
          </NeumorphicCard>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default AllianceVoting; 