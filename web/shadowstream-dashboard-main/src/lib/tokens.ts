/**
 * Token addresses for Polygon mainnet
 */
export const TOKENS = {
    USDC: {
        address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
    },
    USDT: {
        address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
    },
} as const;

export type TokenSymbol = keyof typeof TOKENS;

export function getTokenByAddress(address: string) {
    const lowerAddress = address.toLowerCase();
    return Object.values(TOKENS).find(
        (t) => t.address.toLowerCase() === lowerAddress
    );
}

export function getTokenBySymbol(symbol: TokenSymbol) {
    return TOKENS[symbol];
}

export default TOKENS;
