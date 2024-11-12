import { useEffect, useState } from 'react';
import { Presale } from '../contracts/presale';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address,  OpenedContract } from '@ton/core';
import { useTonConnect } from './useTonConnect';
import { presaleInfo, contractInfo } from '../utils/utils';
import { PresaleContractAddress } from '../config';
export function useContract() {
    const client = useTonClient();
    const [adminAddress, setAdminAddress] = useState<null | Address>();
    const [presaleInfo, setPresaleInfo] = useState<null | presaleInfo>();
    const [contractInfo, setContractInfo] = useState<null | contractInfo>();
    const [curDate, setCurDate] = useState<number>(0);
    const { sender } = useTonConnect();

    const Contract = useAsyncInitialize(async () => {
        if (!client) return;
        const new_contract = new Presale(
            Address.parse(PresaleContractAddress) // replace with your address from tutorial 2 step 8
        );
        return client.open(new_contract) as OpenedContract<Presale>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!Contract) return;
            setAdminAddress(null);
            setPresaleInfo(null);
            const contractInfo = await Contract.getJettonData();
            const val = await Contract.getAdminAddress();
            const info = await Contract.getPRESALEData();
            const cur = await client?.getContractState(Address.parse(PresaleContractAddress));
            console.log('--info--', info)
            setPresaleInfo(info)
            setAdminAddress(val);
            if(cur)
                setCurDate(cur.timestampt);
            setContractInfo(contractInfo)
        }
        getValue();
    }, [Contract]);

    return {
        value: adminAddress,
        presaleInfo,
        contractAddress: Contract?.address.toString(),
        contractInfo,
        curDate,
        withdrawToAdmin: () => { return Contract?.sendWithdraw(sender); },
        BuyJetton: (amount: bigint) => { return Contract?.sendBuy(sender, amount) },
        ClaimJetton: () => { return Contract?.sendClaim(sender) },
        WithdrawTon: () => { return Contract?.sendWithdraw(sender) },
        // getRemainTime: async () => {return (parseInt(Contract?.getPRESALEEndDate()) - (await client.getContractState(Address.parse(PresaleContractAddress))).timestampt);},
        // getBuyAmount: (user_wallet: string) => { return Contract?.getBuyAmount(Address.parse(user_wallet)) }
        // getJetton : (value : bigint, addr: Address) =>{ return Contract?.sendGetJetton(sender, value, addr); } ,
        // sendAirdrop : (dict: Dictionary<bigint, AirdropEntry>, address: Address) => {return Airdrop?.sendAirdrop(sender, dict, address);}
    };
}
