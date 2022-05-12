var provider = new ethers.providers.Web3Provider(window.ethereum);
var abi = [
  'function buyPre(uint8) external payable',
  'function buy(uint8) external payable',
  'function preOpenTime() view returns (uint256)',
  'function openTime() view returns (uint256)',
  'function hasOpened() view returns (bool)',
  'function hasPreOpened() view returns (bool)',
  'function whitelist(address) view returns (bool)',
  'function remain() view returns (uint256)',
  'function sold() view returns (uint256)',
];
var address = '0xdcd633c764068cf385dd404f54de1e0ff283b8fb';

function connect() {
  provider.send('eth_requestAccounts', []);
}

function getAddress() {
  setInterval(function () {
    document.querySelector('#selected-address').innerText =
      'address: ' + provider.provider.selectedAddress;
  }, 3000);
}

function sold() {
  setInterval(function () {
    new ethers.Contract(address, abi, provider).sold().then(function (a) {
      document.querySelector('#sold').innerText = 'sold: ' + a;
    });
  }, 3000);
}

function hasOpened() {
  setInterval(function () {
    var contract = new ethers.Contract(address, abi, provider);
    contract.hasOpened().then(function (b) {
      contract.openTime().then(function (t) {
        document.querySelector('#has-opened').innerText =
          'has opened(' + t + '): ' + b;
      });
    });
  }, 3000);
}

function hasPreOpened() {
  setInterval(function () {
    var contract = new ethers.Contract(address, abi, provider);
    contract.hasPreOpened().then(function (b) {
      contract.preOpenTime().then(function (t) {
        document.querySelector('#has-pre-opened').innerText =
          'has pre opened(' + t + '): ' + b;
      });
    });
  }, 3000);
}

function whitelist() {
  var signer = provider.getSigner();
  signer.getAddress().then(function (addr) {
    new ethers.Contract(address, abi, provider)
      .whitelist(addr)
      .then(function (r) {
        document.querySelector('#whitelist').innerText = 'whitelist: ' + r;
      });
  });
}

function remain() {
  setInterval(function () {
    new ethers.Contract(address, abi, provider).remain().then(function (r) {
      document.querySelector('#remain').innerText = 'remain: ' + r;
    });
  }, 3000);
}

function txLogger(r) {
  document.querySelector('#tx').innerText = 'tx: ' + r.hash;
}

function buyPre(amount) {
  var signer = provider.getSigner();
  var contract = new ethers.Contract(address, abi, signer);
  contract
    .buyPre(amount, {
      value: ethers.utils.parseEther((0.09 * amount).toString()),
    })
    .then(txLogger);
}

function buy(amount) {
  var signer = provider.getSigner();
  var contract = new ethers.Contract(address, abi, signer);
  contract
    .buy(amount, { value: ethers.utils.parseEther((0.12 * amount).toString()) })
    .then(txLogger);
}
