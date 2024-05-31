const { BigNumber, ethers } = require("hardhat");

async function main() {
    var accounts;
    accounts = await ethers.getSigners();

    const abi = [
        // Read-Only Functions
        "function balanceOf(address owner) view returns (uint256)",
        // Authenticated Functions
        "function transfer(address to, uint amount) returns (boolean)",
    ];
    const vitalik_address = "0xc08a8a9f809107c5A7Be6d90e315e4012c99F39a";
    const daiToken_address = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; 
    const my_address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

    // impersonating vitalik's account
    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [vitalik_address],
    });

    // uniswap contract
    daiToken = await ethers.getContractAt("contracts/interfaces/IERC20.sol:IERC20", daiToken_address);

    const vitalik_Balance = (await daiToken.balanceOf(vitalik_address)).toString();

    await daiToken.transfer(
        my_address,
        ethers.BigNumber.from(vitalik_Balance)
    );

    if ((await daiToken.balanceOf(my_address) == vitalik_Balance)) {
        console.log(`Wohoo!! You now have ${ethers.utils.formatEther(vitalik_Balance)} DAI Tokens!`);
        console.log(await daiToken.balanceOf(accounts[0].address));
    }
}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })