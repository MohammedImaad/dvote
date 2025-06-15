import { useEffect, useState } from "react";
import { ethers } from "ethers";
import votingAbi from "../contracts/VotingABI.json";
import { votingAddress } from "../contracts/VotingAddress"; // Your deployed address

function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProposal, setNewProposal] = useState("");

  // Load proposals from smart contract
  useEffect(() => {
    const loadProposals = async () => {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(votingAddress, votingAbi.abi, signer);

      const count = await contract.proposalCount();
      const loaded = [];

      for (let i = 1; i <= count; i++) {
        const [id, desc, votes] = await contract.getProposal(i);
        loaded.push({ id: id.toString(), description: desc, voteCount: votes.toString() });
      }

      setProposals(loaded);
      setLoading(false);
    };

    loadProposals();
  }, []);

  // Add new proposal
  const addProposal = async () => {
    if (!newProposal) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(votingAddress, votingAbi.abi, signer);

    try {
      const tx = await contract.addProposal(newProposal);
      await tx.wait();
      alert("Proposal added!");
      setNewProposal("");
      window.location.reload(); // Refresh the proposals
    } catch (err) {
      alert("Failed to add proposal. Are you the admin?");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Proposals</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Enter proposal description"
        />
        <button onClick={addProposal}>Add Proposal</button>
      </div>

      {loading ? (
        <p>Loading proposals...</p>
      ) : (
        <ul>
          {proposals.map((p) => (
            <li key={p.id}>
              <strong>{p.description}</strong> — {p.voteCount} votes
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Proposals;
