import { ethers } from 'hardhat';
import { NarutoCommunityMedal__factory } from '../typechain-types';

const main = async () => {
  const signer = ethers.provider.getSigner();
  const contract = NarutoCommunityMedal__factory.connect(
    process.env.NCM_ADDRESS as string,
    signer,
  );

  const amount = parseInt(process.env.BATCH_MINT_AMOUNT as string, 10);
  const receivers = [];
  for (let i = 0; i < amount; i++) {
    receivers.push(await signer.getAddress());
  }

  const tx = await contract.batchMint(receivers);
  console.log('tx', tx.hash);
  await tx.wait();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
