import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Address, fromNano } from "@ton/ton";

export const getTonClient = async () => {

    const client = new TonClient({
        endpoint: await getHttpEndpoint({ network: 'mainnet' }),
    })

    return client;
}

export const getTonBalance = async (address: Address | string) => {

    try {
        let addr: Address;
        if (!(address instanceof Address)) {
            addr = Address.parse(address)
        } else {
            addr = address;
        }

        const client = await getTonClient();
        const balance = await client.getBalance(addr);

        return Number(fromNano(balance));
    } catch (e) {
        return 0;
    }
}