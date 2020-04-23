import { Injector, InjectFlags } from '../di/index.ts'
import { PlatformRef } from './platform_ref.ts';
import { ALLOW_MULTIPLE_PLATFORMS, PLATFORM_INITIALIZER } from './token.ts';
let _platform: PlatformRef;
export function getPlatform(): PlatformRef | null {
    return _platform && !_platform.destroyed ? _platform : null;
}
export function createPlatform(injector: Injector): PlatformRef {
    if (_platform && !_platform.destroyed &&
        !_platform.injector.get(ALLOW_MULTIPLE_PLATFORMS, false)) {
        throw new Error('There can be only one platform. Destroy the previous one to create a new one.');
    }
    _platform = injector.get(PlatformRef);
    return _platform;
}
