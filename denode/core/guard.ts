import { Injector } from "../di/index.ts";
export interface CanLoad {
    canLoad(injector: Injector): boolean;
}
export function isCanLoad(val: any): val is CanLoad {
    return val && typeof val.canLoad === 'function'
}
