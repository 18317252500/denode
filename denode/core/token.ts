import { InjectionToken, Type } from "../di/index.ts";
/**
 * app id
 */
export const APP_ID = new InjectionToken(`@nger/core APP_ID`);
/**
 * 平台名称
 */
export const PLATFORM_NAME = new InjectionToken(`@nger/core PLATFORM_NAME`)
export const PLATFORM_TITLE = new InjectionToken(`@nger/core PLATFORM_TITLE`)
/**
 * 模块名
 */
export const MODULE_NAME = new InjectionToken(`@nger/core MODULE_NAME`)
export const MODULE_TITLE = new InjectionToken(`@nger/core MODULE_TITLE`)
/**
 * global 全局变量
 */
export const GLOBAL = new InjectionToken(`@nger/core GLOBAL`);
/**
 * 模块初始化
 */
export const APP_INITIALIZER = new InjectionToken<Array<() => void>>('Application Initializer');
/**
 * 平台初始化
 */
export const PLATFORM_INITIALIZER = new InjectionToken<Array<() => void>>('Platform Initializer');
/**
 * 允许多个平台
 */
export const ALLOW_MULTIPLE_PLATFORMS = new InjectionToken<boolean>('AllowMultipleToken');
/**
 * 入口路径
 */
export const MAIN_PATH = new InjectionToken<boolean>('@nger/core MAIN_PATH');
/**
 * 当前变量
 */
export const CURRENT = new InjectionToken<any>(`@nger/core CURRENT`)
/**
 * 请求
 */
export const REQ = new InjectionToken<any>(`@nger/core REQ`)
/**
 * 请求id
 */
export const REQ_ID = new InjectionToken<any>(`@nger/core REQ_ID`)

/**
 * 响应
 */
export const RES = new InjectionToken<any>(`@nger/core RES`)
/**
 * ip
 */
export const IP = new InjectionToken<string>(`@nger/core IP`)
/**
 * 模块
 */
export type NgerModule = Type<any> | Type<any>[] | InjectionToken<Type<any>> | InjectionToken<Type<any>[]>;
export const LAZY_MODULES = new InjectionToken<NgerModule>(`@nger/core LAZY_MODULES`)

export const MIDDLE_WARES = new InjectionToken<any>(`@nger/core MIDDLE_WARES`)
