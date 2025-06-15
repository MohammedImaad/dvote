import React, { useEffect, useState } from "react";
import { useVotingContract } from "./hooks/useVoting";

function App() {
  const { contract, account } = useVotingContract();
  const [proposals, setProposals] = useState([]);
  const [newProposal, setNewProposal] = useState("");

  useEffect(() => {
    const loadProposals = async () => {
      if (!contract) return;

      try {
        const count = await contract.proposalCount();
        const loaded = [];

        for (let i = 1; i <= count; i++) {
          const [id, description, voteCount] = await contract.getProposal(i);
          loaded.push({ id, description, voteCount });
        }

        setProposals(loaded);
      } catch (err) {
        console.error("Error loading proposals:", err);
      }
    };

    loadProposals();
  }, [contract]);

  const addProposal = async () => {
    if (!contract || !newProposal.trim()) return;

    try {
      const tx = await contract.addProposal(newProposal);
      await tx.wait();
      alert("Proposal added!");
      setNewProposal("");
      // Reload proposals
      const count = await contract.proposalCount();
      const updated = [];

      for (let i = 1; i <= count; i++) {
        const [id, description, voteCount] = await contract.getProposal(i);
        updated.push({ id, description, voteCount });
      }

      setProposals(updated);
    } catch (error) {
      alert("Only the admin can add proposals.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Transparent Voting DApp</h1>
      <p>Connected as: {account}</p>

      <div>
        <input
          type="text"
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Enter proposal description"
        />
        <button onClick={addProposal}>Add Proposal</button>
      </div>

      <ul>
        {proposals.map((p) => (
          <li key={p.id.toString()}>
            {p.description} — Votes: {p.voteCount.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
