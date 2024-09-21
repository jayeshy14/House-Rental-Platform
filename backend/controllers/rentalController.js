import { mintProperty, createAgreement, payRent, payRentWithToken } from '../services/ethersService';
import RentalProperty from '../database/rentalSchema';

// Create a rental property
export async function createRentalProperty(req, res) {
    const { address, tokenURI } = req.body;
    try {
        const tokenId = await mintProperty(address, tokenURI);
        const rentalProperty = new RentalProperty({ tokenId, address, tokenURI });
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

// Pay rent with ERC20 token
export async function payRentWithToken(req, res) {
    const { propertyId, amount } = req.body;
    try {
        await payRentWithToken(propertyId, amount);
        res.status(200).json({ message: 'Rent paid with token' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
