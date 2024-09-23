import { mintProperty, createAgreement, payRent } from '../services/ethersService';
import { uploadToPinata, uploadJsonToPinata } from '../services/pinataService';
import RentalProperty from '../database/rentalSchema';

// Create a rental property
export async function createRentalProperty(req, res) {
    const { address, name, description, location, rentAmount } = req.body;
    const file = req.file; // Assuming file is sent as 'file' field in multipart/form-data

    try {
        // Upload file to Pinata
        const fileRes = await uploadToPinata(file);
        const fileHash = fileRes.IpfsHash;

        // Create JSON metadata
        const metadata = {
            name,
            description,
            location,
            image: `ipfs://${fileHash}`,
            rentAmount
        };

        // Upload JSON metadata to Pinata
        const jsonRes = await uploadJsonToPinata(metadata);
        const tokenURI = `ipfs://${jsonRes.IpfsHash}`;

        // Mint property NFT
        const tokenId = await mintProperty(address, tokenURI);
        const rentalProperty = new RentalProperty({ tokenId, address, tokenURI, name, description, location, rentAmount, image: `ipfs://${fileHash}` });
        await rentalProperty.save();

        res.status(200).json({ tokenId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Create a rental agreement
export async function createRentalAgreement(req, res) {
    const { tenant, propertyId, rentAmount, startDate, endDate } = req.body;
    try {
        await createAgreement(tenant, propertyId, rentAmount, startDate, endDate);
        res.status(200).json({ message: 'Rental agreement created' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Pay rent in Ether
export async function payRent(req, res) {
    const { propertyId, amount } = req.body;
    try {
        await payRent(propertyId, amount);
        res.status(200).json({ message: 'Rent paid in Ether' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

