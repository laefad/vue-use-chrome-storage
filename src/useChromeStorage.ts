import { ref, reactive, watch } from 'vue';
import type {
    ChromeStorageOptions,
    ChromeStorage,
    Nullable
} from './types';

/**
 * Hook used for reactive access to the chrome storage.
 */
export function useChromeStorage <
    Id extends string, 
    Value extends object
>(
    { id, defaultState, storageArea = 'local' }: ChromeStorageOptions<Id, Value>
): ChromeStorage<Value> {

    const state = reactive<Value>(defaultState);
    const error = ref<Nullable<string>>(null);

    watch(state, (currentState) => {
        chrome.storage[storageArea]
            .set({ [id]: currentState })
            .then(() => {
                error.value = null;
            })
            // TODO this catch works ??
            .catch(() => {
                error.value = chrome.runtime.lastError?.message ?? "";
            })
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area == storageArea && id in changes) {
            Object.assign(state, changes[id].newValue);
        }
    });

    // Initial data retrieval
    chrome.storage[storageArea]
        .get({ [id]: defaultState })
        .then(({ [id]: data }) => {
            Object.assign(state, data);
            error.value = null;
        })
        // TODO this catch works ??
        .catch(() => {
            error.value = chrome.runtime.lastError?.message ?? "";
        });

    return {
        state,
        error
    };

};
