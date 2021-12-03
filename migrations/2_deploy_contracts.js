const BidEther = artifacts.require("BidEther");


module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(BidEther)

	// //assign token into variable to get it's address
	// const token = await Token.deployed()
	
	// //pass token address for dBank contract(for future minting)
	// await deployer.deploy(dBank, token.address)

	// //assign dBank contract into variable to get it's address
	// const dbank = await dBank.deployed()

	// //change token's owner/minter from deployer to dBank
	// await token.passMinterRole(dbank.address)
};