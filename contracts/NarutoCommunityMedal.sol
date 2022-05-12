//SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NarutoCommunityMedal is ERC721("Naruto Community Medal", "NCM"), Ownable {
    uint256 public nextTokenId = 1;
    string public url;
    string public description;

    constructor(string memory _url, string memory _description) {
        url = _url;
        description = _description;
    }

    function mint(address _receiver) public onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(_receiver, tokenId);
    }

    function batchMint(address[] memory _receivers) external onlyOwner {
        for (uint256 i = 0; i < _receivers.length; i++) {
            mint(_receivers[i]);
        }
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return
            string(
                abi.encodePacked(
                    '{"name":"NCM #',
                    Strings.toString(tokenId),
                    '","description":"',
                    description,
                    '","image":"',
                    url,
                    '"}'
                )
            );
    }
}
