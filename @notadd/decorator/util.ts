import { getMetadata } from '../reflect-metadata/index.ts'
export const getDesignType = (target: any, propertyKey: PropertyKey) => getMetadata('design:type', target, propertyKey as any);
export const getDesignParamTypes = (target: any, propertyKey?: PropertyKey) => getMetadata('design:paramtypes', target, propertyKey as any);
export const getDesignTargetParams = (target: any) => getMetadata('design:paramtypes', target);
export const getDesignReturnType = (target: any, propertyKey: PropertyKey) => getMetadata('design:returntype', target, propertyKey as any);
