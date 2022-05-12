import { ethers } from 'hardhat';

const main = async () => {
  const nmp = await ethers
    .getContractFactory('NarutoMuseumPass')
    .then((factory) => factory.deploy(100000));
  await nmp.deployed();

  console.log('NarutoMuseumPass deployed to:', nmp.address);
  const [owner] = await ethers.getSigners();
  let tx = await nmp.connect(owner).setMinter(owner.address, true);
  await tx.wait();

  const sale = await ethers
    .getContractFactory('Sale')
    .then((factory) => factory.deploy(nmp.address));
  await sale.deployed();

  console.log('Sale deployed to:', sale.address);

  tx = await nmp.connect(owner).setMinter(sale.address, true);
  await tx.wait();
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
