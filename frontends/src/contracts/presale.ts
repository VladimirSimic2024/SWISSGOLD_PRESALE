import { Address, beginCell, Cell, Contract, Dictionary, contractAddress, ContractProvider, Sender, SendMode, toNano } from '@ton/core';

export type PresaleContent = {
    type: 0 | 1,
    uri: string
};

export type PresaleConfig = { totalSupply: bigint, admin: Address; wallet_code: Cell, state: number, price: bigint, cap: bigint, presale_start_date: number, presale_end_date: number, total_sold_jettons: bigint, reward: number, buying_jetton_amount: number, target: Address };

export function jettonMinterConfigToCell(config: PresaleConfig): Cell {
    return beginCell()
        .storeUint(config.totalSupply, 64)
        .storeBit(config.state)
        .storeUint(config.price, 64)
        .storeUint(config.cap, 64)
        .storeUint(config.presale_start_date, 32)
        .storeUint(config.presale_end_date, 32)
        .storeDict(Dictionary.empty(
            Dictionary.Keys.Address(),
            Dictionary.Values.Cell(),
        ))
        .storeAddress(config.admin)
        .storeRef(config.wallet_code)
        .storeUint(config.total_sold_jettons, 64)
        // .storeAddress(config.subscriber)
        .storeUint(config.reward, 32)
        .storeUint(config.buying_jetton_amount, 32)
        .storeAddress(config.target)
        .endCell();
}


export class Presale implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new Presale(address);
    }

    static createFromConfig(config: PresaleConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new Presale(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY
        });
    }

    // static mintMessage(to: Address, jetton_amount: bigint, forward_ton_amount: bigint, total_ton_amount: bigint,) {
    //     return beginCell().storeUint(0x4fda1e51, 32).storeUint(0, 64) // op, queryId
    //         .storeAddress(to).storeCoins(jetton_amount)
    //         .storeCoins(forward_ton_amount).storeCoins(total_ton_amount)
    //         .endCell();
    // }

    // async sendMint(provider: ContractProvider, via: Sender, to: Address, jetton_amount: bigint, forward_ton_amount: bigint, total_ton_amount: bigint,) {
    //     await provider.internal(via, {
    //         sendMode: SendMode.PAY_GAS_SEPARATELY,
    //         body: Presale.mintMessage(to, jetton_amount, forward_ton_amount, total_ton_amount,),
    //         value: total_ton_amount + toNano("0.1"),
    //     });
    // }

    static discoveryMessage(owner: Address, include_address: boolean) {
        return beginCell().storeUint(0x2c76b973, 32).storeUint(0, 64) // op, queryId
            .storeAddress(owner).storeBit(include_address)
            .endCell();
    }

    async sendDiscovery(provider: ContractProvider, via: Sender, owner: Address, include_address: boolean, value: bigint = toNano('0.1')) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.discoveryMessage(owner, include_address),
            value: value,
        });
    }

    static changeAdminMessage(newOwner: Address) {
        return beginCell().storeUint(0x4840664f, 32).storeUint(0, 64) // op, queryId
            .storeAddress(newOwner)
            .endCell();
    }

    async sendChangeAdmin(provider: ContractProvider, via: Sender, newOwner: Address) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.changeAdminMessage(newOwner),
            value: toNano("0.1"),
        });
    }


    static stateMessage(state: boolean) {
        return beginCell().storeUint(0x58ca5361, 32).storeUint(0, 64) // op, queryId
            .storeBit(state)
            .endCell();
    }

    async sendChangeState(provider: ContractProvider, via: Sender, state: boolean) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.stateMessage(state),
            value: toNano('0.2')
        });

    }

    static startTimeMessage(start_time: number) {
        return beginCell().storeUint(0x46ed2e96, 32).storeUint(0, 64) // op, queryId
            .storeUint(start_time, 32)
            .endCell();
    }

    async sendChangeStartTime(provider: ContractProvider, via: Sender, startTime: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.startTimeMessage(startTime),
            value: toNano('0.2')
        });
    }
    static endTimeMessage(end_time: number) {
        return beginCell().storeUint(0x46ed2e98, 32).storeUint(0, 64) // op, queryId
            .storeUint(end_time, 32)
            .endCell();
    }

    async sendChangeEndTime(provider: ContractProvider, via: Sender, endTime: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.endTimeMessage(endTime),
            value: toNano('0.2')
        });
    }
    static priceMessage(price: bigint) {
        return beginCell().storeUint(0x46ed2e9a, 32).storeUint(0, 64) // op, queryId
            .storeUint(price, 32)
            .endCell();
    }

    async sendChangePrice(provider: ContractProvider, via: Sender, price: bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.priceMessage(price),
            value: toNano('0.2')
        });
    }
    static capMessage(cap: bigint) {
        return beginCell().storeUint(0x46ed2e9c, 32).storeUint(0, 64) // op, queryId
            .storeUint(cap, 64)
            .endCell();
    }

    async sendChangeCap(provider: ContractProvider, via: Sender, cap: bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.capMessage(cap),
            value: toNano('0.2')
        });
    }

    static rewardMessage(reward: number) {
        return beginCell().storeUint(0x46ed2e9e, 32).storeUint(0, 64) // op, queryId
            .storeUint(reward, 32)
            .endCell();
    }

    async sendChangeReward(provider: ContractProvider, via: Sender, reward: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.rewardMessage(reward),
            value: toNano('0.2')
        });
    }
    static buyingJettonAmountMessage(buying_jetton_amount: number) {
        return beginCell().storeUint(0x46ed2ea0, 32).storeUint(0, 64) // op, queryId
            .storeUint(buying_jetton_amount, 32)
            .endCell();
    }

    async sendChangeBuyingJettonAmount(provider: ContractProvider, via: Sender, buying_jetton_amount: number) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.buyingJettonAmountMessage(buying_jetton_amount),
            value: toNano('0.2')
        });
    }

    static withdrawMessage() {
        return beginCell().storeUint(0x46ed2e94, 32).storeUint(0, 64).storeAddress(Address.parse("kQCaLbDcBDRhQalalP1admLhB2XzLBNYpfS-K_WvQgMKtorg")) // op, queryId
            .endCell();
    }

    async sendWithdraw(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.withdrawMessage(),
            value: toNano('0.1')
        });

    }

    static buyMessage() {
        return beginCell().storeUint(0x402eff0b, 32).storeUint(0, 64) // op, queryId
            .endCell();
    }

    async sendBuy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.buyMessage(),
            value
        });
    }

    static claimMessage() {
        return beginCell().storeUint(0x43c7d5c9, 32).storeUint(0, 64).storeAddress(Address.parse("kQCaLbDcBDRhQalalP1admLhB2XzLBNYpfS-K_WvQgMKtorg")) // op, queryId
            .endCell();
    }
    async sendClaim(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Presale.claimMessage(),
            value: toNano('0.1')
        });

    }


    async getJettonData(provider: ContractProvider) {
        let res = await provider.get('get_jetton_data', []);
        let totalSupply = res.stack.readBigNumber();
        let mintable = res.stack.readBoolean();
        let adminAddress = res.stack.readAddress();
        let walletCode = res.stack.readCell();
        console.log(res.stack)
        // let user_data = res.stack.readCell();
        // console.log(user_data)
        return {
            totalSupply,
            mintable,
            adminAddress,
            walletCode,
            // user_data
        };
    }

    async getTotalSupply(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        console.log(res)
        return res.totalSupply;
    }

    async getAdminAddress(provider: ContractProvider) {
        let res = await this.getJettonData(provider);

        return res.adminAddress;
    }


    async getPRESALEData(provider: ContractProvider) {
        let res = await provider.get('get_presale_data', []);
        let state = res.stack.readBoolean();
        let price = res.stack.readBigNumber();
        let cap = res.stack.readBigNumber();
        let start_date = res.stack.readNumber();
        let end_date = res.stack.readNumber();
        let total_sold_jettons = res.stack.readBigNumber();
        let reward = res.stack.readNumber();
        let buying_jetton_amount = res.stack.readNumber();
        return {
            state,
            price,
            cap,
            start_date,
            end_date,
            total_sold_jettons,
            reward,
            buying_jetton_amount
        };
    }

    async getAmountByUser(provider: ContractProvider, owner: Address) {
        const data = beginCell()
            .storeAddress(owner)
            .endCell();
        let res = await provider.get('get_buy_amount', [{ type: 'slice', cell: data }]);
        let amount = res.stack.readBigNumber();
        return amount
    }

    async getPRESALEState(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.state;
    }

    async getTokenPrice(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.price;
    }
    async getReward(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.reward;
    }
    async getBuyingJettonAmount(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.buying_jetton_amount;
    }

    async getPRESALECap(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.cap;
    }

    async getPRESALEStartDate(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.start_date;
    }

    async getPRESALEEndDate(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.end_date;
    }
    async getPRESALETotalSoldJettons(provider: ContractProvider) {
        let res = await this.getPRESALEData(provider);
        return res.total_sold_jettons;
    }

}