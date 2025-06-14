import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { votingAddress } from "../contracts/VotingAddress";
import votingAbi from "../contracts/VotingABI.json";

export function useVotingContract() {
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(votingAddress, votingAbi.abi, signer);
        const account = await signer.getAddress();

        setContract(contract);
        setSigner(signer);
        setAccount(account);
      } else {
        alert("MetaMask not found!");
      }
    };

    init();
  }, []);

  return { contract, signer, account };
}
