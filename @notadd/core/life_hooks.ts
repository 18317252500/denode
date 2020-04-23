export interface OnModuleInit {
    ngOnModuleInit(): any;
}
export function isWithOnModuleInit(val: any): val is OnModuleInit {
    return typeof val.ngOnModuleInit === 'function'
}
export interface OnDestroy {
    ngOnDestroy(): any;
}
export function isWithOnDestroy(val: any): val is OnModuleInit {
    return typeof val.ngOnDestroy === 'function'
}