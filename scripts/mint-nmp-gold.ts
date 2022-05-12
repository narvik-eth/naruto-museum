import { ethers } from 'hardhat';
import { NarutoMuseumPass__factory } from '../typechain-types';

const main = async () => {
  const [owner] = await ethers.getSigners();
  const nmp = NarutoMuseumPass__factory.connect(
    process.env.NMP_ADDRESS as string,
    owner,
  );

  const tx = await nmp.mintGold(owner.address);
  console.log(tx.hash);
  await tx.wait();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
