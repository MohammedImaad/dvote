// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public admin;
    uint public proposalCount;

    struct Proposal {
        uint id;
        string description;
        uint voteCount;
    }

    mapping(uint => Proposal) public proposals;
    mapping(address => bool) public hasVoted;

    event ProposalCreated(uint id, string description);
    event Voted(address voter, uint proposalId);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function addProposal(string memory _description) public onlyAdmin {
        proposalCount++;
        proposals[proposalCount] = Proposal(proposalCount, _description, 0);
        emit ProposalCreated(proposalCount, _description);
    }

    function vote(uint _proposalId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");

        hasVoted[msg.sender] = true;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }

    function getProposal(uint _proposalId) public view returns (
        uint id,
        string memory description,
        uint voteCount
    ) {
        Proposal memory p = proposals[_proposalId];
        return (p.id, p.description, p.voteCount);
    }
}
