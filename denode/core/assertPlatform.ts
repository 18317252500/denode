import { PlatformRef } from './platform_ref.ts'
import { getPlatform } from './createPlatform.ts'

export function assertPlatform(requiredToken: any): PlatformRef {
    const platform = getPlatform();
    if (!platform) {
        throw new Error('No platform exists!');
    }
    if (!platform.injector.get(requiredToken, null)) {
        throw new Error(
            'A platform with a different configuration has been created. Please destroy it first.');
    }
    return platform;
}
