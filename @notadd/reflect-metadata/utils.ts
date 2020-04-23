export type MemberDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
const supportsSymbol = typeof Symbol === "function";
const toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
const Metadata = new WeakMap<any, Map<string | symbol | undefined, Map<any, any>>>();
export const enum Tag {
    Undefined,
    Null,
    Boolean,
    String,
    Symbol,
    Number,
    Object
}

export function isUndefined(x: any): x is undefined {
    return x === undefined;
}
export function isNull(x: any): x is null {
    return x === null;
}
export function isSymbol(x: any): x is symbol {
    return typeof x === "symbol";
}
export function isObject<T>(x: T | undefined | null | boolean | string | symbol | number): x is T {
    return typeof x === "object" ? x !== null : typeof x === "function";
}
export function isArray(argument: any): argument is any[] {
    return Array.isArray
        ? Array.isArray(argument)
        : argument instanceof Object
            ? argument instanceof Array
            : Object.prototype.toString.call(argument) === "[object Array]";
}
export function toPropertyKey(argument: any): string | symbol {
    const key = toPrimitive(argument, Tag.String);
    if (isSymbol(key)) return key;
    return toString(key);
}

export function decorateProperty(decorators: MemberDecorator[], target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor | undefined): PropertyDescriptor | undefined {
    for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target, propertyKey, descriptor);
        if (!isUndefined(decorated) && !isNull(decorated)) {
            if (!isObject(decorated)) throw new TypeError();
            descriptor = <PropertyDescriptor>decorated;
        }
    }
    return descriptor;
}

export function isCallable(argument: any): argument is Function {
    // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
    return typeof argument === "function";
}

export function isConstructor(argument: any): argument is Function {
    // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
    return typeof argument === "function";
}

export function decorateConstructor(decorators: ClassDecorator[], target: Function): Function {
    for (let i = decorators.length - 1; i >= 0; --i) {
        const decorator = decorators[i];
        const decorated = decorator(target);
        if (!isUndefined(decorated) && !isNull(decorated)) {
            if (!isConstructor(decorated)) throw new TypeError();
            target = <Function>decorated;
        }
    }
    return target;
}
export function type(x: any): Tag {
    if (x === null) return Tag.Null;
    switch (typeof x) {
        case "undefined": return Tag.Undefined;
        case "boolean": return Tag.Boolean;
        case "string": return Tag.String;
        case "symbol": return Tag.Symbol;
        case "number": return Tag.Number;
        case "object": return x === null ? Tag.Null : Tag.Object;
        default: return Tag.Object;
    }
}
export function toPrimitive(input: any, PreferredType?: Tag): undefined | null | boolean | string | symbol | number {
    switch (type(input)) {
        case Tag.Undefined: return input;
        case Tag.Null: return input;
        case Tag.Boolean: return input;
        case Tag.String: return input;
        case Tag.Symbol: return input;
        case Tag.Number: return input;
    }
    const hint: "string" | "number" | "default" = PreferredType === Tag.String ? "string" : PreferredType === Tag.Number ? "number" : "default";
    const exoticToPrim = getMethod(input, toPrimitiveSymbol);
    if (exoticToPrim !== undefined) {
        const result = exoticToPrim.call(input, hint);
        if (isObject(result)) throw new TypeError();
        return result;
    }
    return ordinaryToPrimitive(input, hint === "default" ? "number" : hint);
}

export function getMethod(V: any, P: any): Function | undefined {
    const func = V[P];
    if (func === undefined || func === null) return undefined;
    if (!isCallable(func)) throw new TypeError();
    return func;
}
export function toString(argument: any): string {
    return "" + argument;
}

export function ordinaryToPrimitive(O: any, hint: "string" | "number"): undefined | null | boolean | string | symbol | number {
    if (hint === "string") {
        const toString = O.toString;
        if (isCallable(toString)) {
            const result = toString.call(O);
            if (!isObject(result)) return result;
        }
        const valueOf = O.valueOf;
        if (isCallable(valueOf)) {
            const result = valueOf.call(O);
            if (!isObject(result)) return result;
        }
    }
    else {
        const valueOf = O.valueOf;
        if (isCallable(valueOf)) {
            const result = valueOf.call(O);
            if (!isObject(result)) return result;
        }
        const toString = O.toString;
        if (isCallable(toString)) {
            const result = toString.call(O);
            if (!isObject(result)) return result;
        }
    }
    throw new TypeError();
}

export function ordinaryGetMetadata(MetadataKey: any, O: any, P: string | symbol | undefined): any {
    const hasOwn = ordinaryHasOwnMetadata(MetadataKey, O, P);
    if (hasOwn) return ordinaryGetOwnMetadata(MetadataKey, O, P);
    const parent = ordinaryGetPrototypeOf(O);
    if (!isNull(parent)) return ordinaryGetMetadata(MetadataKey, parent, P);
    return undefined;
}

function ordinaryGetOwnMetadata(MetadataKey: any, O: any, P: string | symbol | undefined): any {
    const metadataMap = getOrCreateMetadataMap(O, P, /*Create*/ false);
    if (isUndefined(metadataMap)) return undefined;
    return metadataMap.get(MetadataKey);
}

function getOrCreateMetadataMap(O: any, P: string | symbol | undefined, Create: boolean): Map<any, any> | undefined {
    let targetMetadata = Metadata.get(O);
    if (isUndefined(targetMetadata)) {
        if (!Create) return undefined;
        targetMetadata = new Map<string | symbol | undefined, Map<any, any>>();
        Metadata.set(O, targetMetadata);
    }
    let metadataMap = targetMetadata.get(P);
    if (isUndefined(metadataMap)) {
        if (!Create) return undefined;
        metadataMap = new Map<any, any>();
        targetMetadata.set(P, metadataMap);
    }
    return metadataMap;
}

function ordinaryHasOwnMetadata(MetadataKey: any, O: any, P: string | symbol | undefined): boolean {
    const metadataMap = getOrCreateMetadataMap(O, P, /*Create*/ false);
    if (isUndefined(metadataMap)) return false;
    return toBoolean(metadataMap.has(MetadataKey));
}
function toBoolean(argument: any): boolean {
    return !!argument;
}
const functionPrototype = Object.getPrototypeOf(Function);
function ordinaryGetPrototypeOf(O: any): any {
    const proto = Object.getPrototypeOf(O);
    if (typeof O !== "function" || O === functionPrototype) return proto;
    if (proto !== functionPrototype) return proto;

    // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
    const prototype = O.prototype;
    const prototypeProto = prototype && Object.getPrototypeOf(prototype);
    if (prototypeProto == null || prototypeProto === Object.prototype) return proto;

    // If the constructor was not a function, then we cannot determine the heritage.
    const constructor = prototypeProto.constructor;
    if (typeof constructor !== "function") return proto;

    // If we have some kind of self-reference, then we cannot determine the heritage.
    if (constructor === O) return proto;

    // we have a pretty good guess at the heritage.
    return constructor;
}
export function isPropertyKey(argument: any): argument is string | symbol {
    switch (type(argument)) {
        case Tag.String: return true;
        case Tag.Symbol: return true;
        default: return false;
    }
}
export function ordinaryDefineOwnMetadata(MetadataKey: any, MetadataValue: any, O: any, P: string | symbol | undefined): void {
    const metadataMap = getOrCreateMetadataMap(O, P, /*Create*/ true);
    metadataMap!.set(MetadataKey, MetadataValue);
}
