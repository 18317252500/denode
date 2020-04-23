import { PLATFORM_ID, Provider, providerToStaticProvider, Injector, Type, InjectFlags, GET_INGER_DECORATOR, StaticProvider, INJECTOR, INJECTOR_SCOPE } from "../../di/index.ts"
import { IClassDecorator } from "../../decorator/index.ts";
import { APP_INITIALIZER, PLATFORM_INITIALIZER } from "../token.ts";
export type ProviderArray = Provider | Array<ProviderArray>;
export function prividersToStatic(it: ProviderArray): StaticProvider | StaticProvider[] {
    if (Array.isArray(it)) return it.map(i => prividersToStatic(i)).flat()
    else return providerToStaticProvider(it)
}
export function compileAny<M, I>(
    init: I,
    injector: Injector,
    moduleType: Type<M>
): I | undefined {
    const nger = getNger(injector, moduleType)
    const ngModuleRef = anyReduce<M, any, I>(nger.classes, injector, init)
    if (ngModuleRef) return ngModuleRef;
}
export function getNger(injector: Injector, type: Type<any>) {
    const getDecorator = injector.get(GET_INGER_DECORATOR);
    return getDecorator(type)
}
export interface AnyReduceHandler<T, O, I> {
    (old: I, current: IClassDecorator<T, O>, injector: Injector): I;
}
export function anyReduce<T, O, I>(arrs: IClassDecorator<T, O>[], injector: Injector, init: I): I {
    return arrs.reduce<I>((prev: I, current: IClassDecorator<T, O>) => {
        if (current.metadataKey) {
            const handler = injector.get<AnyReduceHandler<T, O, I>>(current.metadataKey, null, InjectFlags.Optional);
            if (handler) return handler(init, current, injector);
        }
        throw new Error(`${current.metadataKey} hander not found`)
    }, init)
}
/**
 * 设置static provider to Root
 */
export function setStaticProviderWithRoot(injector: Injector, staticProviders: StaticProvider[]) {
    const root = injector.getInjector('root')
    setStaticProvider(injector, filterChildProvider(staticProviders, root))
}
/**
 * 迭代设置，直到root
 */
export function setStaticProvider(injector: Injector, provider: StaticProvider[]) {
    injector.setStatic(provider)
    if (injector.scope === 'root') return;
    if (injector.parent) {
        if (injector.parent.scope === 'root') {
            injector.parent.setStatic(provider)
        } else {
            setStaticProvider(injector.parent, provider)
        }
    }
}
export function filterChildProvider(provider: StaticProvider[], root: Injector): StaticProvider[] {
    return handlerProvider(provider, root)
}
function handlerProvider(provider: StaticProvider[], root: Injector): StaticProvider[] {
    const platform = root.getInjector('platform')
    /**
     * 往根注入的
     */
    return provider.filter(it => {
        if (!it) return false;
        if (it.provide === Injector) return false;
        if (it.provide === INJECTOR) return false;
        if (it.provide === INJECTOR_SCOPE) return false;
        if (it.provide === APP_INITIALIZER) {
            if (platform) root.setStatic([it])
            return false
        }
        if (it.provide === PLATFORM_INITIALIZER) {
            if (platform) platform.setStatic([it])
            return false
        }
        if (it.provide === PLATFORM_ID) {
            return false
        }
        return true;
    });
}
