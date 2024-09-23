import axios from 'axios';
import FormData from 'form-data';
import { pinataApiKey, pinataSecretApiKey } from '../config/keys';

const pinataBaseUrl = 'https://api.pinata.cloud/pinning';

export async function uploadToPinata(file) {
    const data = new FormData();
    data.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
    });

    const res = await axios.post(`${pinataBaseUrl}/pinFileToIPFS`, data, {
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey
        }
    });

    return res.data;
}

export async function uploadJsonToPinata(json) {
    const res = await axios.post(`${pinataBaseUrl}/pinJSONToIPFS`, json, {
        headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey
        }
    });

    return res.data;
}
