import 'dotenv/config';
import { address, toNano, } from '@ton/core';
import { Presale } from '../wrappers/presale';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const totalSupply = process.env.JETTON_TOTAL_SUPPLY ? BigInt(process.env.JETTON_TOTAL_SUPPLY).valueOf() : BigInt(1000000000);
    const admin = address(process.env.JETTON_ADMIN ? process.env.JETTON_ADMIN : "");
    const target = address(process.env.TARGET_ADDRESS ? process.env.TARGET_ADDRESS : "");
    console.log('---adim', admin)
    // const subscriber = address(process.env.JETTON_SUBSCRIBER ? process.env.JETTON_SUBSCRIBER : "");
   
    const wallet_code = await compile('JettonWallet');
    const state = process.env.JETTON_STATE ? Number(process.env.JETTON_STATE).valueOf() : 0;
    const price = process.env.JETTON_PRICE ? BigInt(process.env.JETTON_PRICE).valueOf() : BigInt(1000000000);
    const cap = process.env.JETTON_CAP ? BigInt(process.env.JETTON_CAP).valueOf() : BigInt(1000000000);
    const presale_start_date = process.env.JETTON_PRESALE_START_DATE ? Number(process.env.JETTON_PRESALE_START_DATE).valueOf() : 0;
    const presale_end_date = process.env.JETTON_PRESALE_END_DATE ? Number(process.env.JETTON_PRESALE_END_DATE).valueOf() : 0;
    const reward = process.env.JETTON_REWARD ? Number(process.env.JETTON_REWARD).valueOf() : 0;
    const buying_jetton_amount = process.env.JETTON_BUYING_AMOUNT ? Number(process.env.JETTON_BUYING_AMOUNT).valueOf() : 0;
    const total_sold_jettons = 0n;
    const minter = provider.open(
        Presale.createFromConfig(
            {
                totalSupply,
                admin,
                wallet_code,
                state,
                price,
                cap,
                presale_start_date,
                presale_end_date,
                total_sold_jettons,
                // subscriber,
                reward,
                buying_jetton_amount,
                target
            },
            await compile('presale')
        )
    );

    console.log('--minter', minter)
    const result = await minter.sendDeploy(provider.sender(), toNano('0.05'));
    console.log('--result', result)
    await provider.waitForDeploy(minter.address);

    // console.log('getTotalSupply', await minter.getTotalSupply());
}