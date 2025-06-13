async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment(); // ✅ This works with newer versions

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
