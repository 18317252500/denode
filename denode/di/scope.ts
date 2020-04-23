import { InjectionToken } from './injection_token.ts';
export const INJECTOR_SCOPE = new InjectionToken<'root' | 'platform' | string | null>('Set Injector scope.');
