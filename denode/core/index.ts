export * from './assertPlatform.ts';
export * from './compilerFactory.ts';
export * from './createPlatform.ts';
export * from './createPlatformFactory.ts';
export * from './error_handler.ts';
export * from './lang.ts';
export * from './platform_ref.ts';
export * from './life_hooks.ts';
export * from './core.ts';
export * from '../di/index.ts';
export * from './isDevMode.ts';
export * from './ngModuleRef.ts';
export * from './decorator/index.ts';
export * from './token.ts';
export * from './pipeTransform.ts';
export * from './guard.ts';
export * from './config.ts';
export * from './handlers/index.ts'
export * from './logger.ts';
export { setStaticProviderWithRoot } from './handlers/util.ts';
export { Plain, PlainPro, PlainModuleRef } from '../plain/index.ts';
export interface Abstract<T> extends Function {
    prototype: T;
}
