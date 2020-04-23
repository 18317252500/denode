import { APP_INITIALIZER, PLATFORM_INITIALIZER, LAZY_MODULES } from "./token.ts";
import { Injector, Type, InjectFlags, InjectionToken } from "../di/index.ts";
import { NgModuleRef } from "./ngModuleRef.ts";
import { remove } from "./lang.ts";
import { compileNgModuleRef } from "./compilerFactory.ts";
export abstract class NgModuleBootstrap {
  abstract run<T>(moduleRef: NgModuleRef<T>): Promise<any>;
}
export interface BootstrapOptions { }
export class PlatformRef {
  private _modules: NgModuleRef<any>[] = [];
  private _destroyListeners: Function[] = [];
  private _destroyed: boolean = false;
  get injector(): Injector {
    return this._injector;
  }
  get destroyed() {
    return this._destroyed;
  }
  constructor(private _injector: Injector) { }

  async bootstrapModule<M>(moduleType: Type<M>): Promise<NgModuleRef<M>> {
    // todo 注入启动参数
    const moduleRef = compileNgModuleRef(this.injector, moduleType, "root");
    /**
     * 平台初始化
     */
    const inits = (this.injector.get<Function[]>(PLATFORM_INITIALIZER, [], InjectFlags.Optional) || []).flat();
    if (inits) await Promise.all(inits.map(async (init: any) => await init(this.injector)))
    moduleRef.onDestroy(() => {
      remove(this._modules, moduleRef)
    });
    const appInits = moduleRef.get<any[]>(APP_INITIALIZER, []);
    if (appInits) {
      for (let i = 0; i < appInits.length; i++) {
        await appInits[i]();
      }
    }
    await this._moduleDoBootstrap(moduleRef);
    await moduleRef.onInit();
    const lazyModules = moduleRef.get<any[] | any>(LAZY_MODULES, null)
    if (Array.isArray(lazyModules)) {
      lazyModules.map(mod => {
        if (mod instanceof InjectionToken) {
        } else {
        }
      })
    } else if (lazyModules) {
      if (lazyModules && lazyModules instanceof InjectionToken) {
      } else {
      }
    }
    this.onDestroy(moduleRef.destroy.bind(moduleRef));
    return moduleRef;
  }

  private _moduleDoBootstrap(moduleRef: NgModuleRef<any>) {
    const bootstrap = this.injector.get<NgModuleBootstrap[]>(
      NgModuleBootstrap,
      []
    );
    const tasks: any[] = [];
    bootstrap.map((b: NgModuleBootstrap) => {
      tasks.push(b.run(moduleRef));
    });
    return Promise.all(tasks);
  }

  // 注册销毁钩子
  onDestroy(callback: () => void): void {
    this._destroyListeners.push(callback);
  }

  addModuleRef(moduleRef: NgModuleRef<any>) {
    this._modules.push(moduleRef);
  }

  // 销毁
  destroy() {
    if (this._destroyed) {
      throw new Error("The platform has already been destroyed!");
    }
    this._modules.slice().forEach(module => module.destroy());
    this._destroyListeners.forEach(listener => listener());
    this._destroyed = true;
  }
}
