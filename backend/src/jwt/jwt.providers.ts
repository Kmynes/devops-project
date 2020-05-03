import * as path from 'path';
import * as fs from 'fs';

export const jwtProviders = [
    {
        provide:'JWT_TOKEN_DURATION',
        useFactory:() => {
            return Number(process.env.nbr_jwt_duration);
        }
    },
    {
        provide:'JWT_RSA_PUBLICKEY',
        useFactory:() => {
            const fileName = path.join(__dirname, '../../config/publicKey.pem');
            if (!fs.existsSync(fileName))
                throw new Error(`${fileName} doesn't exist`);
            return fs.readFileSync(fileName, 'utf8');
        }
    },
    {
        provide:'JWT_RSA_PRIVATEKEY',
        useFactory:() => {
            const fileName = path.join(__dirname, '../../config/privateKey.pem');
            if (!fs.existsSync(fileName))
                throw new Error(`${fileName} doesn't exist`);
            return fs.readFileSync(fileName, 'utf8');
        }
    },
    {
        provide:'HASH_JWT_TOKEN_BLACKLIST',
        useFactory:() => {
            return process.env.hash_jwt_blacklist;
        }
    }
];