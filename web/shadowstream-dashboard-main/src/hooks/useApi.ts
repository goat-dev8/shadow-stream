import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUserVaults,
    createPolicyVault,
    getVaultActivity,
    getMerchantApis,
    createMerchantApi,
    getAgents,
    createAgent,
    getUserAnalytics,
    getMerchantAnalytics,
    payAndCall,
    type CreateVaultInput,
    type CreateMerchantApiInput,
    type CreateAgentInput,
    type PayAndCallInput,
} from '@/lib/api';

// ============ User Vaults ============

export function useUserVaults(userAddress: string | null) {
    return useQuery({
        queryKey: ['userVaults', userAddress],
        queryFn: () => getUserVaults(userAddress!),
        enabled: !!userAddress,
        staleTime: 30000,
    });
}

export function useCreateVault() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPolicyVault,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['userVaults', variables.userAddress] });
        },
    });
}

export function useVaultActivity(vaultAddress: string | null) {
    return useQuery({
        queryKey: ['vaultActivity', vaultAddress],
        queryFn: () => getVaultActivity(vaultAddress!),
        enabled: !!vaultAddress,
        staleTime: 10000,
    });
}

// ============ Merchants ============

export function useMerchantApis(adminAddress: string | null) {
    return useQuery({
        queryKey: ['merchantApis', adminAddress],
        queryFn: () => getMerchantApis(adminAddress!),
        enabled: !!adminAddress,
        staleTime: 30000,
    });
}

export function useCreateMerchantApi() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMerchantApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['merchantApis', variables.adminAddress] });
        },
    });
}

// ============ Agents ============

export function useAgents(orgAddress: string | null) {
    return useQuery({
        queryKey: ['agents', orgAddress],
        queryFn: () => getAgents(orgAddress!),
        enabled: !!orgAddress,
        staleTime: 30000,
    });
}

export function useCreateAgent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createAgent,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['agents', variables.orgAddress] });
        },
    });
}

// ============ Analytics ============

export function useUserAnalytics(userAddress: string | null) {
    return useQuery({
        queryKey: ['userAnalytics', userAddress],
        queryFn: () => getUserAnalytics(userAddress!),
        enabled: !!userAddress,
        staleTime: 60000,
    });
}

export function useMerchantAnalytics(adminAddress: string | null) {
    return useQuery({
        queryKey: ['merchantAnalytics', adminAddress],
        queryFn: () => getMerchantAnalytics(adminAddress!),
        enabled: !!adminAddress,
        staleTime: 60000,
    });
}

// ============ Pay and Call ============

export function usePayAndCall() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: payAndCall,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vaultActivity', variables.vaultAddress] });
            queryClient.invalidateQueries({ queryKey: ['userVaults'] });
        },
    });
}
