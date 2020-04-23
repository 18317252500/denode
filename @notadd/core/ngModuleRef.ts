import { Injector, Type, InjectFlags, IToken, Provider } from "../di/index.ts";
import { isWithOnModuleInit } from "./life_hooks.ts";
export class NgModuleRef<T> {
  private _destroyListeners: Function[] = [];
  private _destroyed: boolean = false;
  injector: Injector;
  get instance(): T {
    return this.injector.get(this.type);
  }
  get type(): Type<T> {
    return this._type;
  }
  imports: NgModuleRef<any>[] = [];
  providers: (Provider | Provider[])[] = [];
  exports: Type<any>[] = [];
  constructor(injector: Injector, private _type: Type<T>) {
    this.injector = injector;
  }
  getModuleRef<T>(type: Type<any>, ...children: Type<any>[]): NgModuleRef<T> {
    let res: NgModuleRef<any> | undefined;
    res = this.imports.find(it => it.type === type);
    if (children.length > 0) {
      children.map(child => {
        if (res) res = res.getModuleRef(child);
      });
    }
    if (res) return res;
    throw new Error(`can not found ${type.name} module`);
  }
  get<T>(
    token: IToken<T>,
    notFoundValue?: T | undefined | null,
    flags?: InjectFlags
  ) {
    return this.injector.get(token, notFoundValue, flags);
  }
  destroy(): void {
    if (this._destroyed) {
      throw new Error("The platform has already been destroyed!");
    }
    this.imports.slice().forEach(module => module.destroy());
    this._destroyListeners.forEach(listener => listener());
    this._destroyed = true;
  }
  onDestroy(callback: () => void): void {
    this._destroyListeners.push(callback);
  }
  async onInit() {
    await Promise.all(this.imports.map(async imp => await imp.onInit()));
    if (isWithOnModuleInit(this.instance)) {
      await this.instance.ngOnModuleInit();
    }
    return this;
  }
}
