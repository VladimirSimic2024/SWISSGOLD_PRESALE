import { Address, beginCell, Cell, fromNano, OpenedContract, toNano, } from '@ton/core';
import { compile, sleep, NetworkProvider, UIProvider, } from '@ton/blueprint';
import { Presale,  } from '../wrappers/presale';
import { promptBool, promptAmount, promptAddress, displayContentCell, waitForTransaction, promptUrl, } from '../wrappers/utils';
let minterPRESALEContract: OpenedContract<Presale>;

const adminActions = [  'Change state', 'Withdrawal', 'Change price', 'Change start time', 'Change end time', 'Change cap', 'Change admin', 'Change state', 'Change reward', 'Change buying jetton amount' ];
const userActions  = ['Info', 'Quit','Buy','Claim'];

const failedTransMessage = (ui: UIProvider) => {
    ui.write("Failed to get indication of transaction completion from API!\nCheck result manually, or try again\n");
};

const infoAction = async (provider: NetworkProvider, ui: UIProvider) => {
    const jettonData = await minterPRESALEContract.getJettonData();
    ui.write("Jetton info:\n\n");
    ui.write(`Admin: ${jettonData.adminAddress}\n`);
    ui.write(`Total supply: ${fromNano(jettonData.totalSupply)}\n`);
    ui.write(`Mintable: ${jettonData.mintable}\n`);

    ui.write(`----------Jetton amount by User (${jettonData.adminAddress})-----------------\n`);
    const amountByUser = await minterPRESALEContract.getAmountByUser(jettonData.adminAddress)
    ui.write(`You can get ${amountByUser} $PEPE\n`);

    const displayPRESALE = await ui.choose('Display PRESALE info?', ['Yes', 'No'], (c) => c);
    if (displayPRESALE == 'Yes') {
        const PRESALEData = await minterPRESALEContract.getPRESALEData();
        ui.write("PRESALE info:\n\n");
        ui.write(`State: ${PRESALEData.state}\n`);
        ui.write(`Price: ${PRESALEData.price}\n`);
        ui.write(`Cap: ${PRESALEData.cap}\n`);
        ui.write(`Start date: ${fromNano(PRESALEData.start_date)}\n`);
        ui.write(`End date: ${fromNano(PRESALEData.end_date)}\n`);
        ui.write(`Total sold jettons: ${PRESALEData.total_sold_jettons}\n`);
        ui.write(`Reward: ${PRESALEData.reward}\n`);
        ui.write(`Buying Jetton Amount: ${PRESALEData.buying_jetton_amount}\n`);
    }
};

const changeAdminAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newAdmin: Address;
    let curAdmin = await minterPRESALEContract.getAdminAddress();
    do {
        retry = false;
        newAdmin = await promptAddress('Please specify new admin address:', ui);
        if (newAdmin.equals(curAdmin)) {
            retry = true;
            ui.write("Address specified matched current admin address!\nPlease pick another one.\n");
        }
        else {
            ui.write(`New admin address is going to be: ${newAdmin}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");

    await minterPRESALEContract.sendChangeAdmin(provider.sender(), newAdmin);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const adminAfter = await minterPRESALEContract.getAdminAddress();
        if (adminAfter.equals(newAdmin)) {
            ui.write("Admin changed successfully");
        } else {
            ui.write("Admin address hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changeStateAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newPRESALEState: boolean;
    let curPRESALEState = await minterPRESALEContract.getPRESALEState();
    do {
        retry = false;
        newPRESALEState = await promptBool('Please specify new state, yes - pause, no - resume:', ['yes', 'no'], ui);
        if (curPRESALEState == newPRESALEState) {
            retry = true;
            ui.write("PRESALE state specified matched current state!\nPlease pick another one.\n");
        } else {
            ui.write(`New PRESALE state is going to be: ${newPRESALEState}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");

    await minterPRESALEContract.sendChangeState(provider.sender(), newPRESALEState);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getPRESALEState();
        if (stateAfter == newPRESALEState) {
            ui.write("PRESALE state changed successfully");
        } else {
            ui.write("PRESALE state hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changePriceAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newTokenPrice: bigint = 0n;
    let curTokenPrice = await minterPRESALEContract.getTokenPrice();
    do {
        retry = false;
        const priceString = await promptAmount('Please specify new price:', ui);
        newTokenPrice = BigInt(Number(priceString) * 10 ** 9);
        ui.write(`new price---${newTokenPrice}`);
        if (curTokenPrice == newTokenPrice) {
            retry = true;
            ui.write("Token price specified matched current price!\nPlease pick another one.\n");
        } else {
            ui.write(`New Token price is going to be: ${newTokenPrice}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new price---1--${newTokenPrice}`);
    await minterPRESALEContract.sendChangePrice(provider.sender(), newTokenPrice);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getTokenPrice();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newTokenPrice) {
            ui.write("Token price changed successfully");
        } else {
            ui.write("Token price hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changeStartTimeAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newStartDate: number = 0;
    let curStartDate = await minterPRESALEContract.getPRESALEStartDate();
    do {
        retry = false;
        const startTimeString = await promptAmount('Please specify start date(Unxi epoch time):', ui);
        newStartDate = Number(startTimeString);
        ui.write(`new start date---${newStartDate}`);
        if (curStartDate == newStartDate) {
            retry = true;
            ui.write("Start date specified matched current date!\nPlease pick another one.\n");
        } else {
            ui.write(`New start date is going to be: ${newStartDate}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new price---1--${newStartDate}`);
    await minterPRESALEContract.sendChangeStartTime(provider.sender(), newStartDate);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getPRESALEStartDate();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newStartDate) {
            ui.write("Start date changed successfully");
        } else {
            ui.write("Start date hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changeEndTimeAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newEndDate: number = 0;
    let curEndDate = await minterPRESALEContract.getPRESALEEndDate();
    do {
        retry = false;
        const endDateString = await promptAmount('Please specify end date(Unxi epoch time):', ui);
        newEndDate = Number(endDateString);
        ui.write(`new end date---${newEndDate}`);
        if (curEndDate == newEndDate) {
            retry = true;
            ui.write("End date specified matched current date!\nPlease pick another one.\n");
        } else {
            ui.write(`New end date is going to be: ${newEndDate}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new end date---1--${newEndDate}`);
    await minterPRESALEContract.sendChangeEndTime(provider.sender(), newEndDate);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getPRESALEEndDate();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newEndDate) {
            ui.write("End date changed successfully");
        } else {
            ui.write("End date hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changeCapAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newCap: bigint = 0n;
    let curCap = await minterPRESALEContract.getPRESALECap();
    do {
        retry = false;
        const capString = await promptAmount('Please specify cap:', ui);
        newCap = BigInt(Number(capString) * 10 ** 9);
        ui.write(`new cap---${newCap}`);
        if (curCap == newCap) {
            retry = true;
            ui.write("Cap specified matched current cap!\nPlease pick another one.\n");
        } else {
            ui.write(`New cap is going to be: ${newCap}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new end date---1--${newCap}`);
    await minterPRESALEContract.sendChangeCap(provider.sender(), newCap);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getPRESALECap();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newCap) {
            ui.write("End cap changed successfully");
        } else {
            ui.write("End cap hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const ClaimAction = async (provider: NetworkProvider, ui: UIProvider) => {
    const sender = provider.sender();
   
    
    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");

    const res = await minterPRESALEContract.sendClaim(sender);
    const gotTrans = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (gotTrans) {
      
    }
    else {
        failedTransMessage(ui);
    }

}

const changeRewardAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newReward: number = 0;
    let curReward = await minterPRESALEContract.getReward();
    do {
        retry = false;
        const rewardString = await promptAmount('Please specify new reward:', ui);
        newReward = Number(rewardString);
        ui.write(`new reward---${newReward}`);
        if (curReward == newReward) {
            retry = true;
            ui.write("Reward specified matched current price!\nPlease pick another one.\n");
        } else {
            ui.write(`New Reward is going to be: ${newReward}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new reward---1--${newReward}`);
    await minterPRESALEContract.sendChangeReward(provider.sender(), newReward);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getReward();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newReward) {
            ui.write("Reward changed successfully");
        } else {
            ui.write("Reward hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const changeBuyingJettonAmountAction = async (provider: NetworkProvider, ui: UIProvider) => {
    let retry: boolean;
    let newBuyingJettonAmount: number = 0;
    let curBuyingJettonAmount = await minterPRESALEContract.getBuyingJettonAmount();
    do {
        retry = false;
        const buyingJettonAmountString = await promptAmount('Please specify new buying jetton amount:', ui);
        newBuyingJettonAmount = Number(buyingJettonAmountString);
        ui.write(`new buying jetton amount---${newBuyingJettonAmount}`);
        if (curBuyingJettonAmount == newBuyingJettonAmount) {
            retry = true;
            ui.write("Buying jetton amount specified matched current price!\nPlease pick another one.\n");
        } else {
            ui.write(`New Buying jetton amount is going to be: ${newBuyingJettonAmount}\nKindly double check it!\n`);
            retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
        }
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;
    ui.write(`curState---${curState}`);

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");
    ui.write(`new buying jetton amount---1--${newBuyingJettonAmount}`);
    await minterPRESALEContract.sendChangeBuyingJettonAmount(provider.sender(), newBuyingJettonAmount);
    const transDone = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (transDone) {
        const stateAfter = await minterPRESALEContract.getBuyingJettonAmount();
        ui.write(`stateAfter--${stateAfter}`);
        if (stateAfter == newBuyingJettonAmount) {
            ui.write("Buying jetton amount changed successfully");
        } else {
            ui.write("Buying jetton amount hasn't changed!\nSomething went wrong!\n");
        }
    } else {
        failedTransMessage(ui);
    }
};

const buyAction = async (provider: NetworkProvider, ui: UIProvider) => {
    const sender = provider.sender();
    let retry: boolean;
    let amountToBuy: string;

    do {
        retry = false;
        amountToBuy = await promptAmount('Please provide TON amount in decimal form:', ui);
        ui.write(`Buying on ${amountToBuy}\n`);
        retry = !(await promptBool('Is it ok?(yes/no)', ['yes', 'no'], ui));
    } while (retry);

    const supplyBefore = await minterPRESALEContract.getTotalSupply();
    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");

    const res = await minterPRESALEContract.sendBuy(sender, toNano(amountToBuy));
    const gotTrans = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (gotTrans) {
        const supplyAfter = await minterPRESALEContract.getTotalSupply();
        console.log(supplyAfter)
        if (supplyAfter < supplyBefore) {
            ui.write("Buying successfull!\nYou have received:" + fromNano(supplyBefore - supplyAfter));
        }
        else {
            ui.write("Buying failed!");
        }
    }
    else {
        failedTransMessage(ui);
    }
}

const withdrawalAction = async (provider: NetworkProvider, ui: UIProvider) => {
    const sender = provider.sender();
    let retry: boolean;

    do {
        retry = false;
        retry = !(await promptBool('Is it ok to withdraw TON from PRESALE on the admin wallet?(yes/no)', ['yes', 'no'], ui));
    } while (retry);

    const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
    const curState = (await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account;

    if (curState.last === null)
        throw ("Last transaction can't be null on deployed contract");

    const contractBalanceBefore = BigInt((await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account.balance.coins);

    const res = await minterPRESALEContract.sendWithdraw(sender);
    const gotTrans = await waitForTransaction(provider,
        minterPRESALEContract.address,
        curState.last.lt,
        10);
    if (gotTrans) {
        const lastSeqno = (await provider.api().getLastBlock()).last.seqno;
        const contractBalanceAfter = BigInt((await provider.api().getAccountLite(lastSeqno, minterPRESALEContract.address)).account.balance.coins);

        if (contractBalanceAfter < contractBalanceBefore) {
            ui.write("Withdrawal successfull!\nYou have received:" + fromNano(contractBalanceBefore - contractBalanceAfter));
        } else {
            ui.write("Withdrawal failed!");
        }
    } else {
        failedTransMessage(ui);
    }
}

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
    const hasSender = sender.address !== undefined;
    const api = provider.api()
    const minterPRESALECode = await compile('presale');
    let done = false;
    let retry: boolean;
    let PRESALEAddress: Address;

    do {
        retry = false;
        PRESALEAddress = await promptAddress('Please enter PRESALE address:', ui);
        const isContractDeployed = await provider.isContractDeployed(PRESALEAddress);
        if (!isContractDeployed) {
            retry = true;
            ui.write("This contract is not active!\nPlease use another address, or deploy it first");
        }
        else {
            const lastSeqno = (await api.getLastBlock()).last.seqno;
            const contractState = (await api.getAccount(lastSeqno, PRESALEAddress)).account.state as {
                data: string | null;
                code: string | null;
                type: "active";
            };
            if (!(Cell.fromBase64(contractState.code as string)).equals(minterPRESALECode)) {
                ui.write("Contract code differs from the current contract version!\n");
                const resp = await ui.choose("Use address anyway", ["Yes", "No"], (c) => c);
                retry = resp == "No";
            }
        }
    } while (retry);

    minterPRESALEContract = provider.open(Presale.createFromAddress(PRESALEAddress));
    const isAdmin = hasSender ? (await minterPRESALEContract.getAdminAddress()).equals(sender.address) : true;
    let actionList: string[];
    if (isAdmin) {
        actionList = [...adminActions, ...userActions];
        ui.write("Current wallet is PRESALE admin!\n");
    }
    else {
        actionList = userActions;
        ui.write("Current wallet is not admin!\nAvaliable actions restricted\n");
    }

    do {
        const action = await ui.choose("Pick action:", actionList, (c) => c);
        switch (action) {
            case 'Buy':
                await buyAction(provider, ui);
                break;
            case 'Withdrawal':
                await withdrawalAction(provider, ui);
                break;
            case 'Change admin':
                await changeAdminAction(provider, ui);
                break;
         
            case 'Change state':
                await changeStateAction(provider, ui);
                break;
            case 'Change price':
                await changePriceAction(provider, ui);
                break;
            case 'Change start time':
                await changeStartTimeAction(provider, ui);
                break;
            case 'Change end time':
                await changeEndTimeAction(provider, ui);
                break;
            case 'Change cap':
                await changeCapAction(provider, ui);
                break;
            case 'Change reward':
                await changeRewardAction(provider, ui);
                break;
            case 'Change buying jetton amount':
                await changeBuyingJettonAmountAction(provider, ui);
                break;
            case 'Info':
                await infoAction(provider, ui);
                break;
            case 'Claim':
                await ClaimAction(provider, ui);
                break;
            case 'Quit':
                done = true;
                break;
        }
    } while (!done);
}