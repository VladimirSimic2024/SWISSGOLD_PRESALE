import { Address, Cell } from "@ton/core";

export interface presaleInfo {
  state: boolean;
  price: bigint;
  cap: bigint;
  start_date: number;
  end_date: number;
  total_sold_jettons: bigint;
}

export interface jettonData {
  name: string;
  jetton_wallet: string;
  jetton_decimal: number;
}

export interface contractInfo {
  totalSupply: bigint;
  mintable: boolean;
  adminAddress: Address;
  walletCode: Cell;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isNumber(value: string): boolean {
  if (value.length > 0)
    return !isNaN(parseFloat(value)) && isFinite(Number(value));
  else return true;
}
