import { Type, Injector, StaticInjector, Provider, providerToStaticProvider, isType, getClassInjectDeps, NullInjector, topInjector } from "../di/index.ts";
import { getINgerDecorator } from "../decorator/index.ts";
import { ModuleMetadataKey, ModuleOptions } from "./decorator/index.ts";

export function createInjector(
    type: Type<any>,
    parent?: Injector,
    providers: Provider[] = [],
    name?: string
) {
    name = name || type.name;
    parent = parent || topInjector
    const options = getModuleOptions(type)
    const props = getModuleProviders(options, type)
    return new StaticInjector([...providers, ...props].map(pro => providerToStaticProvider(pro)), parent, name)
}
export function getModuleOptions(type: Type<any>): ModuleOptions {
    const nger = getINgerDecorator(type)
    let options: ModuleOptions;
    if (nger) {
        nger.classes.map(it => {
            if (it.metadataKey === ModuleMetadataKey) {
                options = it.options;
            }
        })
    }
    return options!;
}
export function getTypeProvider(type: Type<any>): Provider {
    const nger = getINgerDecorator(type)
    const deps = getClassInjectDeps(nger)
    return {
        provide: type,
        useFactory: (injector: Injector) => {
            return new type(...(deps || []).map(it => injector.get(it)))
        },
        deps: [Injector]
    }
}
export function getModuleProviders(options: ModuleOptions, type: Type<any>): Provider[] {
    const props: Provider[] = [
        getTypeProvider(type)
    ];
    const { id, providers, controllers, imports, exports } = options;
    if (imports) {
        imports.map(it => {
            if (isType(it)) {
                const options = getModuleOptions(it)
                props.push(...getModuleProviders(options, it))
            } else {
                const { ngModule, providers } = it;
                const options = getModuleOptions(ngModule)
                props.push(...getModuleProviders(options, ngModule))
                if (providers) {
                    props.push(...providers.flat())
                }
            }
        })
    }
    if (providers) {
        props.push(...providers.flat())
    }
    return props;
}