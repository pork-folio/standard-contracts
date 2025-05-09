import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  const { isAddress } = hre.ethers.utils;

  const [signer] = await hre.ethers.getSigners();
  if (signer === undefined) {
    throw new Error(
      `Wallet not found. Please, run "npx hardhat account --save" or set PRIVATE_KEY env variable (for example, in a .env file)`
    );
  }

  if (!isAddress(args.contract)) {
    throw new Error("Invalid Ethereum address provided.");
  }

  const contract: any = await hre.ethers.getContractAt(
    args.name,
    args.contract
  );

  const recipient = args.to || signer.address;

  const tx = await contract.mint(recipient, args.amount);
  await tx.wait();

  if (args.json) {
    console.log(
      JSON.stringify({
        contractAddress: args.contract,
        mintTransactionHash: tx.hash,
        recipient: recipient,
      })
    );
  } else {
    console.log(`🚀 Successfully minted NFT.
📜 Contract address: ${args.contract}
👤 Recipient: ${recipient}
🔗 Transaction hash: ${tx.hash}`);
  }
};

export const tokenMint = task("token:mint", "Mint a universal token", main)
  .addParam("contract", "The address of the deployed NFT contract")
  .addOptionalParam(
    "to",
    "The recipient address, defaults to the signer address"
  )
  .addParam("amount", "The amount of tokens to mint")
  .addOptionalParam(
    "name",
    "The contract name to interact with",
    "ZetaChainUniversalToken"
  )
  .addFlag("json", "Output the result in JSON format");
