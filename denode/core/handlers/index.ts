import { moduleHandler } from './module-v2.ts'
import { controllerHandler } from './controller.ts'
import { StaticProvider } from '../../di/index.ts'
import { PlainMetadataKey } from '../../plain/index.ts'
export const handlers: StaticProvider[] = [
    moduleHandler,
    controllerHandler,
    {
        provide: PlainMetadataKey,
        useValue: () => { }
    }
]
export * from './controller.ts';