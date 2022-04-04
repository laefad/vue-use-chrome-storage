import { Ref, UnwrapNestedRefs } from "vue";

export type Nullable<T> = T | null;

export interface ChromeStorage<T extends object> {
    /** 
     * Contains current state, 
     * which may not be synchronized with the chrome storage when an error occurs. 
     */
    state: UnwrapNestedRefs<T>;

    /** 
     * Contains a last error, 
     * but the next operation with storage will set error to null if it is successful. 
     */
    error: Ref<Nullable<string>>;
}

export interface ChromeStorageOptions<
    Id extends string,
    Value
> {
    /** 
     * Contains current value the key name in chrome's storage 
     */
    id: Id;

    /** 
     * The default state, which will be used if the chrome storage is empty. 
     */
    defaultState: Value;

    /** 
     * Contains a chrome storage area type
     * 
     * @see {@link https://developer.chrome.com/docs/extensions/reference/storage/#property| Storage area types} 
     */
    storageArea?: chrome.storage.AreaName;
}
