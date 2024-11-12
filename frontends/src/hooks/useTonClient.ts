import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient } from "@ton/ton";
import { useAsyncInitialize } from './useAsyncInitialize.ts';
// import { net } from '../const.tsx';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({ network: "mainnet" }),
      })
  );
}
