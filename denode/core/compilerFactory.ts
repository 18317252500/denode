import { Injector, InjectFlags, GET_INGER_DECORATOR } from "../di/index.ts";
import { Type, IClassDecorator } from '../decorator/index.ts';
import { NgModuleRef } from './ngModuleRef.ts';
import { ModuleMetadataKey } from "./decorator/index.ts";

export function compileNgModuleRef<M>(
    injector: Injector,
    moduleType: Type<M>,
    scope?: string | Type<M>
): NgModuleRef<M> {
    scope = scope || moduleType;
    const init = new NgModuleRef<M>(injector, moduleType)
    const getDecorator = injector.get(GET_INGER_DECORATOR);
    const nger = getDecorator(moduleType)
    const ngModuleRef = moduleReduce<M, any>(nger.classes, init, scope)
    if (ngModuleRef) return ngModuleRef;
    throw new Error(`Compile Ng ModuleRef Error!${moduleType.name} is not has @Module decorator`)
}
export interface ModuleReduceHandler<T, O> {
    (old: NgModuleRef<T>, current: IClassDecorator<T, O>, scope: string | Type<T>): NgModuleRef<T>;
}
export function moduleReduce<T, O>(arrs: IClassDecorator<T, O>[], init: NgModuleRef<T>, scope: string | Type<T>): NgModuleRef<T> {
    return arrs.reduce<NgModuleRef<T>>((prev: NgModuleRef<T>, current: IClassDecorator<T, O>) => {
        if (current.metadataKey) {
            const handler = init.injector.get<ModuleReduceHandler<T, O>>(current.metadataKey, null, InjectFlags.Optional);
            if (handler) return handler(init, current, scope);
        }
        throw new Error(`hander ${ModuleMetadataKey} error`)
    }, init)
}
