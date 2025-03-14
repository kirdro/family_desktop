import { useCallback } from 'react';
import { QueryKey, UseQueryResult, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const emptyObject = Object.freeze({});

export function useSetToStore<T>(dataKey: QueryKey) {
    const cache = useQueryClient();

    type StoreMutationFn<D> = (storeData: Partial<D>) => Partial<D>;
    type StoreMutation<D> = Partial<D> | StoreMutationFn<D>;

    function isFunctionalMutation<D>(fn: StoreMutation<D>): fn is StoreMutationFn<D> {
        return Object.prototype.toString.call(fn) === '[object Function]';
    }

    return useMutation<Partial<T>, unknown, StoreMutation<T>>({
        // mutationKey: dataKey,
        mutationFn: async (data) => {
            const prevData = cache.getQueryData<T>(dataKey);

            const mergedData =
                Boolean(prevData) && isFunctionalMutation<T>(data)
                    ? { ...prevData, ...data(prevData!) }
                    : { ...prevData, ...data };

            cache.setQueryData(dataKey, mergedData);

            return mergedData;
        },
    });
}

export function useGetFromStore<T>(
    queryKey: QueryKey,
    defaultValue: T,
): UseQueryResult<T, unknown> & { getStore: () => T } {
    // TODO check issue // UseQueryResult<Partial<T>, unknown> {
    const cache = useQueryClient();
    const prevData = cache.getQueryData<T>(queryKey);

    if (!prevData) {
        cache.setQueryData(queryKey, defaultValue);
    }

    const getStore = useCallback(() => {
        const data = cache.getQueryData<T>(queryKey) ?? defaultValue;
        return data;
    }, [cache, queryKey, defaultValue]);
    // TODO
    const queryResult = useQuery<T>({
        queryKey,
        queryFn: getStore,
        enabled: true,
    });

    return { ...queryResult, getStore };
}

export function useStore<T>(dataKey: QueryKey, defaultValue?: T) {
    const { data: store = defaultValue ?? (emptyObject as T), getStore } = useGetFromStore<T>(
        dataKey,
        defaultValue ?? (emptyObject as T),
    );

    const { mutateAsync: updateStore } = useSetToStore<T>(dataKey);

    return { store, getStore, updateStore };
}
