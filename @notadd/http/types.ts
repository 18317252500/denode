import { Injector } from '../core/index.ts'
export type Renderer = {
    templates?: string;
    render<T>(name: string, data: T): Promise<Deno.Reader>;
};

/* `HandlerFunc` defines a function to serve HTTP requests. */
export type HandlerFunc = (c: Injector) => Promise<unknown> | unknown;

/* `MiddlewareFunc` defines a function to process middleware. */
export type MiddlewareFunc = (h: HandlerFunc) => HandlerFunc;

export type Param = {
    key: string;
    value: string;
};
export type Params = Param[];
