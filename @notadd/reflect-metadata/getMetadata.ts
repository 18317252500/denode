import { ordinaryGetMetadata, isObject, isUndefined, toPropertyKey } from './utils.ts'
export function getMetadata(metadataKey: any, target: any, propertyKey?: string | symbol): any {
    if (!isObject(target)) throw new TypeError();
    if (!isUndefined(propertyKey)) propertyKey = toPropertyKey(propertyKey);
    return ordinaryGetMetadata(metadataKey, target, propertyKey);
}
