import React, { useEffect, useState } from "react";
import { useVotingContract } from "./hooks/useVoting";

function App() {
  const { contract, account } = useVotingContract();
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    const loadProposals = async () => {
      if (!contract) return;

      const allProposals = await contract.getProposal(); // assumes such a function exists
      setProposals(allProposals);
    };

    loadProposals();
  }, [contract]);

  return (
    <div>
      <h1>Transparent Voting DApp</h1>
      <p>Connected as: {account}</p>

      <ul>
        {proposals.map((p, i) => (
          <li key={i}>{p.name} — Votes: {p.voteCount.toString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
