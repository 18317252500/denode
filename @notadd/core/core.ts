import { Injector } from '../di/index.ts';
import { DefaultErrorHandler, ErrorHandler } from './error_handler.ts';
import { ALLOW_MULTIPLE_PLATFORMS } from './token.ts';
import { PlatformRef } from './platform_ref.ts';
import { createPlatformFactory } from './createPlatformFactory.ts';
import { handlers } from './handlers/index.ts';
import { Config, DefaultConfig } from './config.ts';
import { PlainModuleRef, createPlain, toPlain } from '../plain/index.ts';
export const corePlatform = createPlatformFactory(null, 'core', [
    ...handlers,
    {
        provide: PlainModuleRef,
        useFactory: () => {
            return {
                create<T>(json: any, key: string = `__plain_desc`, handler?: (source: any, target: any) => any): T {
                    return createPlain(json, key, handler)
                },
                toJson(type: any, key: string = `__plain_desc`, handler?: (source: any, target: any) => any) {
                    return toPlain(type, key, handler);
                }
            }
        },
        deps: []
    },
    {
        provide: Config,
        useClass: DefaultConfig
    },
    {
        provide: ALLOW_MULTIPLE_PLATFORMS,
        useValue: true
    },
    {
        provide: ErrorHandler,
        useClass: DefaultErrorHandler
    },
    {
        provide: PlatformRef,
        useFactory: (injector: Injector) => {
            return new PlatformRef(injector)
        },
        deps: [Injector]
    }
]);
