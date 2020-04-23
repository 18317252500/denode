import {
    StaticProvider,
    providerToStaticProvider,
    isType,
    INJECTOR_SCOPE,
    Type,
    Injector,
    ModuleWithProviders
} from "../../di/index.ts";
import { ModuleMetadataKey, ModuleOptions } from "../decorator/index.ts";
import { IClassDecorator } from "../../decorator/index.ts";
import { NgModuleRef } from "../ngModuleRef.ts";
import { compileNgModuleRef, ModuleReduceHandler } from "../compilerFactory.ts";
import {
    prividersToStatic,
    compileAny,
    setStaticProviderWithRoot
} from "./util.ts";
/**
 * providers 是全局的 ModuleWithProviders是个人的
 * @param init 
 * @param current 
 * @param scope 
 */
const handler: ModuleReduceHandler<any, ModuleOptions> = (
    init: NgModuleRef<any>,
    current: IClassDecorator<any, ModuleOptions>,
    scope: string | Type<any>
) => {
    const options = current.options;
    let injector = init.injector.create([
        {
            provide: INJECTOR_SCOPE,
            useValue: scope
        },
        {
            provide: NgModuleRef,
            useValue: init
        }
    ]);
    if (options) {
        const { providers, imports, controllers, id, exports } = options;
        injector = init.injector.create(
            [
                {
                    provide: INJECTOR_SCOPE,
                    useValue: scope
                }
            ],
            id || current.type.name
        );
        if (exports) init.exports = exports;
        // 处理imports
        if (imports) {
            init.imports = handlerImports(imports, injector)
        }
        // 设置provider
        if (providers) {
            init.providers = providers;
            setStaticProviderWithRoot(
                injector,
                providers.map(it => prividersToStatic(it)).flat()
            );
        }
        // 处理controllers
        if (controllers) {
            // 木有缓存
            injector.setStatic(controllers.map(it => prividersToStatic(it)).flat().map((it: StaticProvider) => ({
                ...it,
                noCache: true
            } as StaticProvider)));
            controllers.map(ctrl => compileAny(undefined, injector, ctrl));
        }
    } else {
        injector = init.injector.create(
            [
                {
                    provide: INJECTOR_SCOPE,
                    useValue: scope
                }
            ],
            current.type.name
        );
    }
    // 设置依赖注入
    init.injector = injector;
    // module type
    init.injector.setStatic([providerToStaticProvider(current.type)]);
    return init;
};
export const moduleHandler: StaticProvider = {
    provide: ModuleMetadataKey,
    useValue: handler
};

function handlerImports(imports: Array<Type<any> | ModuleWithProviders<any>>, injector: Injector) {
    const ngWithModules = imports.filter(imp => {
        if (isType(imp)) return false;
        return true;
    })
    const modules = imports.filter(imp => isType(imp))
    const ngWithModulesRefs = ngWithModules.map((imp: any) => {
        injector.setStatic([
            providerToStaticProvider(imp.ngModule)
        ])
        setStaticProviderWithRoot(
            injector,
            imp.providers.map((it: any) => prividersToStatic(it)).flat()
        );
        const ref = compileNgModuleRef(injector, imp.ngModule);
        if (ref && ref.exports) handlerImports(ref.exports, injector)
        return ref;
    })
    const modulesRefs = modules.map((imp: any) => {
        let ref = compileNgModuleRef(injector, imp);
        injector.setStatic([
            providerToStaticProvider(imp)
        ])
        if (ref && ref.exports) handlerImports(ref.exports, injector)
        return ref;
    })
    return [
        ...ngWithModulesRefs,
        ...modulesRefs
    ].filter(it => !!it)
}