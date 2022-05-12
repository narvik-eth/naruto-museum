import { ethers } from 'hardhat';

const url = process.env.URL as string;
const description = process.env.DESCRIPTION as string;

const main = async () => {
  const contract = await ethers
    .getContractFactory('NarutoCommunityMedal')
    .then((factory) => factory.deploy(url, description));
  await contract.deployed();

  console.log('NarutoCommunityMedal deployed to:', contract.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
