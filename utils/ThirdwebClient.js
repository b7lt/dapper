import { createThirdwebClient, defineChain } from "thirdweb";

export const testBNB = defineChain({
    id: 97,
    // rpc: "https://bsc-testnet.drpc.org",
    rpc: "https://97.rpc.thirdweb.com/" + process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    nativeCurrency: {
        name: "Test BNB",
        symbol: "tBNB",
        decimals: 18,
    },
});

export const client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
})