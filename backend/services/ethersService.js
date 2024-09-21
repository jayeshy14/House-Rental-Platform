import { ethers } from 'ethers';
import { abi } from '../../contract/abi.json';
import { ethereumNodeURL, privateKey, contractAddress } from '../config/keys';
import { Contract, Wallet } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(ethereumNodeURL);
const wallet = new Wallet(privateKey, provider);
const contract = new Contract(contractAddress, abi, wallet);

export async function mintProperty(address, tokenURI) {
    const tx = await contract.mintProperty(address, tokenURI);
    const receipt = await tx.wait();
    const event = receipt.events.find(event => event.event === 'PropertyMinted');
    const tokenId = event.args.tokenId.toNumber();
    return tokenId;
}

export async function createAgreement(tenant, propertyId, rentAmount, startDate, endDate) {
    const tx = await contract.createAgreement(tenant, propertyId, rentAmount, startDate, endDate);
    await tx.wait();
}

export async function payRent(propertyId, amount) {
    const tx = await contract.payRent(propertyId, { value: ethers.parseEther(amount.toString()) });
    await tx.wait();
}

export async function payRentWithToken(propertyId, amount) {
    const tx = await contract.payRentWithToken(propertyId, ethers.parseUnits(amount.toString(), 18));
    await tx.wait();
}
