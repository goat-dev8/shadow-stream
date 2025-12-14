import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CHAIN_CONFIG } from '@/lib/config';

interface WalletContextType {
    address: string | null;
    chainId: number | null;
    isConnected: boolean;
    isConnecting: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    ensurePolygonMainnet: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    const isConnected = !!address;

    // Check if already connected on mount
    useEffect(() => {
        const checkConnection = async () => {
            if (typeof window.ethereum === 'undefined') return;

            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts && accounts.length > 0) {
                    setAddress(accounts[0]);
                    const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
                    setChainId(parseInt(chainIdHex, 16));
                }
            } catch (error) {
                console.error('Error checking wallet connection:', error);
            }
        };

        checkConnection();
    }, []);

    // Listen for account and chain changes
    useEffect(() => {
        if (typeof window.ethereum === 'undefined') return;

        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                setAddress(null);
            } else {
                setAddress(accounts[0]);
            }
        };

        const handleChainChanged = (chainIdHex: string) => {
            setChainId(parseInt(chainIdHex, 16));
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
    }, []);

    const connect = useCallback(async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask or another Web3 wallet');
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAddress(accounts[0]);

            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainIdHex, 16));
        } catch (error: any) {
            console.error('Error connecting wallet:', error);
            if (error.code !== 4001) {
                alert('Failed to connect wallet');
            }
        } finally {
            setIsConnecting(false);
        }
    }, []);

    const disconnect = useCallback(() => {
        setAddress(null);
        setChainId(null);
    }, []);

    const ensurePolygonMainnet = useCallback(async (): Promise<boolean> => {
        if (typeof window.ethereum === 'undefined') return false;

        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (currentChainId === CHAIN_CONFIG.chainIdHex) {
            return true;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: CHAIN_CONFIG.chainIdHex }],
            });
            return true;
        } catch (switchError: any) {
            // Chain not added, try to add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: CHAIN_CONFIG.chainIdHex,
                            chainName: CHAIN_CONFIG.name,
                            nativeCurrency: CHAIN_CONFIG.nativeCurrency,
                            rpcUrls: CHAIN_CONFIG.rpcUrls,
                            blockExplorerUrls: CHAIN_CONFIG.blockExplorerUrls,
                        }],
                    });
                    return true;
                } catch (addError) {
                    console.error('Error adding Polygon network:', addError);
                    return false;
                }
            }
            console.error('Error switching to Polygon:', switchError);
            return false;
        }
    }, []);

    return (
        <WalletContext.Provider
            value={{
                address,
                chainId,
                isConnected,
                isConnecting,
                connect,
                disconnect,
                ensurePolygonMainnet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

// Extend Window interface for ethereum
declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (event: string, handler: (...args: any[]) => void) => void;
            removeListener: (event: string, handler: (...args: any[]) => void) => void;
        };
    }
}
