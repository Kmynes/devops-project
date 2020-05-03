import { readdir } from 'fs';
import { promisify } from "util";

const client_assets = `${__dirname}/../client/assets`;
const getClientAssets = promisify(readdir).bind(null, client_assets);

export const appProviders = [
    {
        provide:'PATH_CLIENT_ASSETS',
        useFactory: () => client_assets
    },
    {
        provide:'CLIENT_ASSETS',
        useFactory: async () => await getClientAssets()
    }
];