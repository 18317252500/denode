import { StaticInjector } from "./injector_ng.ts";
import { INJECTOR_SCOPE } from "./scope.ts";
import { PLATFORM_ID } from "./injector/index.ts";
import { GET_INGER_DECORATOR } from "./providerToStaticProvider.ts";
import { getINgerDecorator } from "../decorator/index.ts";

export const topInjector = new StaticInjector([{
    provide: INJECTOR_SCOPE,
    useValue: 'top'
}, {
    provide: PLATFORM_ID,
    useValue: `unknown`
}, {
    provide: GET_INGER_DECORATOR,
    useValue: getINgerDecorator
}])
