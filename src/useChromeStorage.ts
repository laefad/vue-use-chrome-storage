import { UnwrapNestedRefs, Ref, ref, reactive, watch } from 'vue';

interface ChromeStorage<T> {
    /** Contains current value, 
     * which may not be synchronized with the chrome storage when an error occurs. */
    value: UnwrapNestedRefs<T>;
    /** Contains a last error, 
     * but the next operation with storage will reset this to default if it is successful. */
    error: Ref<string>;
    /** If an error occurred during the read\write, it will be true, 
     * but the next operation with storage will reset this to default if it is successful. */
    hasError: Ref<boolean>;
}

/**
 * Hook used for reactive access to the chrome storage.
 * @param id - the key name in chrome's storage.
 * @param defaultValue - the default value, which will be used if the chrome storage is empty.
 * @param storageArea - https://developer.chrome.com/docs/extensions/reference/storage/#property
 * @returns a hook that is synchronized with the chrome storage.
 */
export const useChromeStorage = <T extends object>(
    id: string,
    defaultValue: T,
    storageArea: chrome.storage.AreaName = "local"
): ChromeStorage<T> => {

    const value = reactive<T>(defaultValue);
    const error = ref("");
    const hasError = ref(false);

    watch(value, (currentState) => {
        chrome.storage[storageArea].set({ [id]: currentState }, () => {
            if (chrome.runtime.lastError) {
                hasError.value = true;
                error.value = chrome.runtime.lastError.message ?? "";
                // TODO NEED TEST THIS ROLLBACK 
                // state.value = previousState;
            } else if (hasError.value) {
                hasError.value = false;
                error.value = "";
            }
        });
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area == storageArea && id in changes) {
            Object.assign(value, changes[id].newValue);
        }
    });

    // Initial data retrieval
    chrome.storage[storageArea].get({ [id]: defaultValue })
        .then(({ [id]: data }) => {
            Object.assign(value, data);
        })
        // TODO this catch works ??
        .catch(() => {
            error.value = chrome.runtime.lastError?.message ?? "";
            hasError.value = true;
        });

    return {
        value,
        error,
        hasError
    };
};
