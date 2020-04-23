import { INgerDecorator } from "../../decorator/index.ts";
import { Injector } from "../injector/index.ts";

export class NgerRef<T> {
    private nger: INgerDecorator<T>;
    private injector: Injector;
    constructor(nger: INgerDecorator<T>, injector: Injector) {
        this.nger = nger;
        this.injector = injector;
    }
    create(_injector: Injector) {
        const injector = _injector || this.injector;
        const instance = injector.get(this.nger.type);
        this.nger.properties.map(it => {
            if (it.metadataKey) {
                const handler = injector.get<any>(it.metadataKey);
                if (handler) {
                    const old = Reflect.get(instance, it.property);
                    handler(old, instance, injector, it);
                }
            }
        });
        this.nger.methods.map(it => {
            const old = Reflect.get(instance, it.property);
            const newCall = (...args: any[]) => {
                let length = it.paramTypes.length > args.length ? it.paramTypes.length : args.length;
                const parameters = new Array(length).fill(undefined);
                it.parameters.map(it => {
                    const handler = injector.get<any>(it.metadataKey, undefined);
                    if (handler)
                        handler(old.bind(instance), parameters, instance, injector, it);
                });
                const pars = parameters.map((it, index) => {
                    return Reflect.get(args, index) || it;
                });
                return old.bind(instance)(...pars);
            };
            Reflect.set(instance, it.property, newCall);
        });
        return instance;
    }
}