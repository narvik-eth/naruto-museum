import { expect } from 'chai';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

const url =
  'ipfs://bafybeifts2slyqammgivi4v6eu2erbgt22fanykkq4thhezwunafsehbwu';
const description = 'TBD';

describe('NCM', function () {
  it('can deploy', async function () {
    const contract = await ethers
      .getContractFactory('NarutoCommunityMedal')
      .then((factory) => factory.deploy(url, description));
    await contract.deployed();
  });
  it('can mint', async function () {
    const contract = await ethers
      .getContractFactory('NarutoCommunityMedal')
      .then((factory) => factory.deploy(url, description));
    await contract.deployed();

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const ncm = contract.connect(owner);

    expect(await ncm.balanceOf(owner.address)).to.be.equal(0);
    await ncm.mint(owner.address);
    expect(await ncm.balanceOf(owner.address)).to.be.equal(1);

    const json = await ncm.tokenURI(1);
    expect(JSON.parse(json)).to.deep.equal({
      name: 'NCM #1',
      description: 'TBD',
      image:
        'ipfs://bafybeifts2slyqammgivi4v6eu2erbgt22fanykkq4thhezwunafsehbwu',
    });
  });
  it('cannot mint with not owner', async function () {
    const contract = await ethers
      .getContractFactory('NarutoCommunityMedal')
      .then((factory) => factory.deploy(url, description));
    await contract.deployed();

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const ncm = contract.connect(signers[1]);
    await expect(ncm.mint(owner.address)).revertedWith(
      'Ownable: caller is not the owner',
    );
  });
  it('can batchMint', async function () {
    const contract = await ethers
      .getContractFactory('NarutoCommunityMedal')
      .then((factory) => factory.deploy(url, description));
    await contract.deployed();

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const ncm = contract.connect(owner);

    expect(await ncm.balanceOf(owner.address)).to.be.equal(0);
    await ncm.batchMint([owner.address, owner.address]);
    expect(await ncm.balanceOf(owner.address)).to.be.equal(2);

    for (let i = 0; i < 2; i++) {
      const json = await ncm.tokenURI(i + 1);
      expect(JSON.parse(json)).to.deep.equal({
        name: `NCM #${i + 1}`,
        description: 'TBD',
        image:
          'ipfs://bafybeifts2slyqammgivi4v6eu2erbgt22fanykkq4thhezwunafsehbwu',
      });
    }
  });
  it('cannot batchMint with not owner', async function () {
    const contract = await ethers
      .getContractFactory('NarutoCommunityMedal')
      .then((factory) => factory.deploy(url, description));
    await contract.deployed();

    const signers = await ethers.getSigners();
    const owner = signers[0];

    const ncm = contract.connect(signers[1]);
    await expect(ncm.batchMint([owner.address])).revertedWith(
      'Ownable: caller is not the owner',
    );
  });
});

const goldTotalSupply = 100000;

describe('NMP', () => {
  it('can deploy', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();
  });
  it('can mintSilver', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    await expect(contract.mintSilver(owner.address)).revertedWith(
      'Only minter.',
    );
    const nmp = contract.connect(owner);
    await expect(nmp.mintSilver(owner.address)).revertedWith('Only minter.');
    await nmp.setMinter(owner.address, true);
    await nmp.mintSilver(owner.address);
    expect(await contract.balanceOf(owner.address)).to.be.equal(1);
  });
  it('can batchMintSilver', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    await expect(
      contract.batchMintSilver([owner.address, owner.address]),
    ).revertedWith('Only minter.');
    const nmp = contract.connect(owner);
    await expect(
      nmp.batchMintSilver([owner.address, owner.address]),
    ).revertedWith('Only minter.');
    await nmp.setMinter(owner.address, true);

    await nmp.batchMintSilver([owner.address, owner.address]);
    expect(await contract.balanceOf(owner.address)).to.be.equal(2);
  });
  it('can mintGold', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    await expect(contract.mintGold(owner.address)).revertedWith('Only minter.');
    const nmp = contract.connect(owner);
    await expect(nmp.mintGold(owner.address)).revertedWith('Only minter.');
    await nmp.setMinter(owner.address, true);
    await nmp.mintGold(owner.address);
    expect(await contract.balanceOf(owner.address)).to.be.equal(1);
  });
  it('can batchMintGold', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    await expect(
      contract.batchMintGold([owner.address, owner.address]),
    ).revertedWith('Only minter.');
    const nmp = contract.connect(owner);
    await expect(
      nmp.batchMintGold([owner.address, owner.address]),
    ).revertedWith('Only minter.');
    await nmp.setMinter(owner.address, true);

    await nmp.batchMintGold([owner.address, owner.address]);
    expect(await contract.balanceOf(owner.address)).to.be.equal(2);
  });
  it('cannot mintGold because reached total supply', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(2));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    const nmp = contract.connect(owner);
    await nmp.setMinter(owner.address, true);

    await nmp.mintGold(owner.address);
    await nmp.mintGold(owner.address);
    await expect(nmp.mintGold(owner.address)).revertedWith(
      'Total supply reached.',
    );
  });
  it('can tokenURI', async () => {
    const contract = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await contract.deployed();

    const [owner] = await ethers.getSigners();

    await expect(contract.tokenURI(goldTotalSupply + 1)).revertedWith(
      'ERC721Metadata: URI query for nonexistent token',
    );

    const nmp = contract.connect(owner);
    await nmp.setMinter(owner.address, true);
    await nmp.mintSilver(owner.address);
    await nmp.mintGold(owner.address);

    expect(
      JSON.parse(await contract.tokenURI(goldTotalSupply + 1)),
    ).to.deep.equal({
      name: 'Naruto Museum Pass | Silver #1',
      description:
        'This is an official pass of NFT Naruto Museum. The pass provides the right to participate in future projects of the museum, such as Naruto Launchpad, Naruto Meta Museum, etc.',
      image:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/silver.png',
      external_url:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/silver.png',
      animation_url:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/silver.mp4',
      attributes: [
        {
          trait_type: 'Edition',
          value: 'Silver',
        },
      ],
    });

    expect(JSON.parse(await contract.tokenURI(1))).to.deep.equal({
      name: 'Naruto Museum Pass | Gold #1',
      description:
        'This is an official pass of NFT Naruto Museum. The pass provides the right to participate in future projects of the museum, such as Naruto Launchpad, Naruto Meta Museum, etc.',
      image:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/gold.png',
      external_url:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/gold.png',
      animation_url:
        'ipfs://bafybeidtuggvku6bqd6cu2dqt4tj6sfc6f4qwdcpli5otacyhyghq5xbrq/gold.mp4',
      attributes: [
        {
          trait_type: 'Edition',
          value: 'Gold',
        },
      ],
    });
  });
});

describe('Sale', () => {
  it('can deploy', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const sale = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await sale.deployed();
  });
  it('can sale', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 100000000000000);

    await expect(sale.buyPre(1, { value: unit('0.09') })).revertedWith(
      'only whitelist.',
    );
    await sale.setWhitelist([owner.address], true);

    await expect(sale.buyPre(1, { value: unit('0.08') })).revertedWith(
      'invalid value',
    );
    await expect(sale.buyPre(1, { value: unit('0.1') })).revertedWith(
      'invalid value',
    );
    expect(await sale.remain()).to.be.equal(999);
    await sale.buyPre(1, { value: unit('0.09') });
    expect(await sale.remain()).to.be.equal(998);
    await expect(sale.buyPre(2, { value: unit('0.18') })).revertedWith(
      'reached limit',
    );
    await expect(sale.buy(1, { value: unit('0.12') })).revertedWith(
      'not opened',
    );
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 1);
    await expect(sale.buyPre(1, { value: unit('0.09') })).revertedWith(
      'closed',
    );
    await sale.buy(1, { value: unit('0.12') });
    expect(await sale.remain()).to.be.equal(997);
    await expect(sale.buy(1, { value: unit('0.12') })).revertedWith(
      'reached limit',
    );
  });
  it('can buyPre', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 100000000000000);

    await expect(sale.buyPre(1, { value: unit('0.09') })).revertedWith(
      'only whitelist.',
    );
    await sale.setWhitelist([owner.address], true);

    await expect(sale.buyPre(1, { value: unit('0.08') })).revertedWith(
      'invalid value',
    );
    await expect(sale.buyPre(1, { value: unit('0.1') })).revertedWith(
      'invalid value',
    );
    expect(await sale.remain()).to.be.equal(999);
    await sale.buyPre(1, { value: unit('0.09') });
    expect(await sale.remain()).to.be.equal(998);
    await expect(sale.buyPre(2, { value: unit('0.18') })).revertedWith(
      'reached limit',
    );
    await sale.buyPre(1, { value: unit('0.09') });
    expect(await sale.remain()).to.be.equal(997);
    await expect(sale.buyPre(1, { value: unit('0.09') })).revertedWith(
      'reached limit',
    );
  });
  it('can bulk buyPre', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 100000000000000);
    await sale.setWhitelist([owner.address], true);

    expect(await sale.remain()).to.be.equal(999);
    await sale.buyPre(2, { value: unit('0.18') });
    expect(await sale.remain()).to.be.equal(997);
  });
  it('can buy', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 1);

    await expect(sale.buy(1, { value: unit('0.11') })).revertedWith(
      'invalid value',
    );
    await expect(sale.buy(1, { value: unit('0.13') })).revertedWith(
      'invalid value',
    );
    expect(await sale.remain()).to.be.equal(999);
    await sale.buy(1, { value: unit('0.12') });
    expect(await sale.remain()).to.be.equal(998);
    await expect(sale.buy(2, { value: unit('0.24') })).revertedWith(
      'reached limit',
    );
    await sale.buy(1, { value: unit('0.12') });
    expect(await sale.remain()).to.be.equal(997);
    await expect(sale.buy(1, { value: unit('0.12') })).revertedWith(
      'reached limit',
    );
  });
  it('can bulk buy', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 1);

    expect(await sale.remain()).to.be.equal(999);
    await sale.buy(2, { value: unit('0.24') });
    expect(await sale.remain()).to.be.equal(997);
  });
  it('can withdraw', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner, user] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 1);
    await sale.buy(2, { value: unit('0.24') });

    await expect(contract.connect(user).withdraw()).revertedWith(
      'Ownable: caller is not the owner',
    );
    const balance = await owner.getBalance();
    await sale.withdraw();
  });
  it('cannot buy because it reached limit', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 1, 0, 1);

    await expect(sale.buy(2, { value: unit('0.24') })).revertedWith('sold out');
    expect(await sale.remain()).to.be.equal(1);
    await sale.buy(1, { value: unit('0.12') });
    expect(await sale.remain()).to.be.equal(0);
  });
  it('cannot buy because it invalid amount', async () => {
    const nmp = await ethers
      .getContractFactory('NarutoMuseumPass')
      .then((factory) => factory.deploy(goldTotalSupply));
    await nmp.deployed();
    const contract = await ethers
      .getContractFactory('Sale')
      .then((factory) => factory.deploy(nmp.address));
    await contract.deployed();

    const [owner] = await ethers.getSigners();
    await nmp.connect(owner).setMinter(contract.address, true);

    const sale = contract.connect(owner);
    const unit = parseEther;
    await sale.setSetting(unit('0.09'), unit('0.12'), 999, 0, 1);

    await expect(sale.buy(0, { value: unit('0') })).revertedWith(
      'invalid amount',
    );
    await expect(sale.buy(3, { value: unit('0.36') })).revertedWith(
      'reached limit',
    );
  });
});
