import { Injector, StaticProvider } from '../../di/index.ts';

export function setStaticProviderWithRoot(injector: Injector, provider: StaticProvider[]) {
    injector.setStatic(provider)
    if (injector.scope === 'root') return;
    if (injector.parent) {
        if (injector.parent.scope === 'root') {
            provider.map(it => {
                const provide = {
                    provide: it.provide,
                    useFactory: () => injector.get(it.provide)
                }
                if (injector.parent) {
                    const record = injector.parent.getRecord(it.provide)
                    if (!record) {
                        injector.parent.setStatic([provide])
                    }
                }
            })
        } else {
            setStaticProviderWithRoot(injector.parent, provider)
        }
    }
}