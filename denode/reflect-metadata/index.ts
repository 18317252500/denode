export * from './getMetadata.ts';
import { isObject, isUndefined, isNull, isArray, toPropertyKey, decorateProperty, isConstructor, decorateConstructor, isPropertyKey, ordinaryDefineOwnMetadata, MemberDecorator } from './utils.ts'

export interface Type<T> extends Function {
    new(...args: any[]): T;
}
function decorate(decorators: (ClassDecorator | MemberDecorator)[], target: any, propertyKey?: string | symbol, attributes?: PropertyDescriptor | null): PropertyDescriptor | Function | undefined {
    if (!isUndefined(propertyKey)) {
        if (!isArray(decorators)) throw new TypeError();
        if (!isObject(target)) throw new TypeError();
        if (!isObject(attributes) && !isUndefined(attributes) && !isNull(attributes)) throw new TypeError();
        if (isNull(attributes)) attributes = undefined;
        propertyKey = toPropertyKey(propertyKey);
        return decorateProperty(<MemberDecorator[]>decorators, target, propertyKey, attributes);
    }
    else {
        if (!isArray(decorators)) throw new TypeError();
        if (!isConstructor(target)) throw new TypeError();
        return decorateConstructor(<ClassDecorator[]>decorators, <Function>target);
    }
}
function metadata(metadataKey: any, metadataValue: any) {
    function decorator(target: Function): void;
    function decorator(target: any, propertyKey: string | symbol): void;
    function decorator(target: any, propertyKey?: string | symbol): void {
        if (!isObject(target)) throw new TypeError();
        if (!isUndefined(propertyKey) && !isPropertyKey(propertyKey)) throw new TypeError();
        ordinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
    }
    return decorator;
}
Reflect.set(Reflect, 'decorate', decorate)
Reflect.set(Reflect, 'metadata', metadata)
