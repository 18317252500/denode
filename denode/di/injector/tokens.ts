import { InjectionToken } from "../injection_token.ts";
import { Injector } from './injector.ts'
import { getClosureSafeProperty } from "../util.ts";
import { NullInjector } from "./null.ts";
import { ValueProvider } from "../type.ts";
export const INJECTOR = new InjectionToken<Injector>(
    'INJECTOR',
    -1 as any  // `-1` is used by Ivy DI system as special value to recognize it as `Injector`.
);
export const PLATFORM_ID = new InjectionToken(`__platform_id__`)

export const THROW_IF_NOT_FOUND = Symbol.for(`_THROW_IF_NOT_FOUND`);

export const IDENT = function <T>(value: T): T {
    return value;
};
export const EMPTY = <any[]>[];
export const CIRCULAR = IDENT;
export const MULTI_PROVIDER_FN = function (): any[] {
    return Array.prototype.slice.call(arguments);
};
export const USE_VALUE =
    getClosureSafeProperty<ValueProvider>({ provide: String, useValue: getClosureSafeProperty });

export const NULL_INJECTOR = new NullInjector();