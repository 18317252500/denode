import { Module } from "./decorator";
import { ModuleWithProviders } from "../di/index.ts";

@Module()
export class LazyModule { 
    /**
     * 根目录
     */
    static forRoot(): ModuleWithProviders{
        return {
            ngModule: LazyModule,
            providers: []
        }
    }
    /**
     * 子模块
     */
    static forFeature(): ModuleWithProviders{
        return {
            ngModule: LazyModule,
            providers: []
        }
    }
}
