import { serve, Server } from '../deno/index.ts';
import {
    Module, ModuleWithProviders, Injector, Injectable,
    APP_INITIALIZER, ControllerOptions, NgerRef,
    GetMetadataKey, PostMetadataKey, GetOptions,
    PutMetadataKey, PutOptions, PostOptions, HeadMetadataKey, HeadOptions,
    PatchMetadataKey, PatchOptions, DeleteMetadataKey, DeleteOptions,
    ConnectMetadataKey, ConnectOptions, OptionsMetadataKey, OptionsOptions,
    TraceMetadataKey, TraceOptions, ContextMetadataKey
} from '../core/index.ts';
import { HTTP_URL, HTTP_REQUEST, HTTP_COOKIES } from './token.ts';
import { getCookies, Status, Response, join, extname, Cookie, setCookie, ServerRequest } from "../deno/index.ts";
import { IClassDecorator, IMethodDecorator, IParameterDecorator } from '../decorator/index.ts';
import { Router } from './router.ts';
import { MIME, Header } from './const.ts';
const { cwd, lstat, readFile } = Deno;
import { NotFoundException, NotImplementedException } from './exception.ts'
export function contentType(filepath: string): string | undefined {
    return MIME.DB[extname(filepath)];
}
export function notFoundHandler(): never {
    throw new NotFoundException();
}

export function notImplemented(): Error {
    return new NotImplementedException("Not Implemented");
}
const encoder = new TextEncoder();
export class HttpContext {
    request: ServerRequest;
    url: URL;
    response: Response = {
        headers: new Headers()
    };
    params: Record<string, string> = {};

    get cookies() {
        return getCookies(this.request);
    }

    get path(): string {
        return this.url.pathname;
    }

    get method(): string {
        return this.request.method;
    }

    get queryParams(): Record<string, string> {
        const params: Record<string, string> = {};
        for (const [k, v] of this.url.searchParams) {
            params[k] = v;
        }
        return params;
    }

    constructor(private injector: Injector) {
        this.request = injector.get(HTTP_REQUEST)
        this.url = new URL(this.request.url, `http://0.0.0.0`);
    }

    setCookie(c: Cookie): void {
        setCookie(this.response, c);
    }

    redirect(url: string, code = Status.Found): void {
        if (!this.response.headers) {
            this.response.headers = new Headers();
        }
        this.response.headers.set(Header.Location, url);
        this.response.status = code;
    }

    string(v: string, code: Status = Status.OK): void {
        this.writeContentType(MIME.TextPlain);
        this.response.status = code;
        this.response.body = encoder.encode(v);
    }

    json(v: Record<string, any> | string, code: Status = Status.OK): void {
        this.writeContentType(MIME.ApplicationJSON);
        this.response.status = code;
        this.response.body = encoder.encode(
            typeof v === "object" ? JSON.stringify(v) : v,
        );
    }

    html(v: string, code: Status = Status.OK): void {
        this.writeContentType(MIME.TextHTML);
        this.response.status = code;
        this.response.body = encoder.encode(v);
    }

    htmlBlob(b: Uint8Array | Deno.Reader, code: Status = Status.OK): void {
        this.blob(b, MIME.TextHTML, code);
    }

    blob(
        b: Uint8Array | Deno.Reader,
        contentType?: string,
        code: Status = Status.OK,
    ): void {
        if (contentType) {
            this.writeContentType(contentType);
        }
        this.response.status = code;
        this.response.body = b;
    }

    async file(filepath: string): Promise<void> {
        filepath = join(cwd(), filepath);
        try {
            const fileinfo = await lstat(filepath);
            if (
                fileinfo.isDirectory &&
                (await lstat(filepath + "index.html")).isFile
            ) {
                filepath = join(filepath, "index.html");
            }
            this.blob(await readFile(filepath), contentType(filepath));
        } catch {
            notFoundHandler();
        }
    }

    private writeContentType(v: string): void {
        if (!this.response.headers) {
            this.response.headers = new Headers();
        }
        if (!this.response.headers.has(Header.ContentType)) {
            this.response.headers.set(Header.ContentType, v);
        }
    }
}
@Injectable()
export class HttpServerRequestHandler {
    handle(injector: Injector): void {
        const router = injector.get(Router);
        const req = injector.get(HTTP_REQUEST)
        const handler = router.find(req.method, injector)
        handler && handler(injector)
    }
}
function register(property: string, method: string, options: any, methodOptions: any, injector: Injector, ref: NgerRef<any>) {
    const path = options!.path || '/';
    const methodPath = methodOptions!.path || '/';
    const _methodPath = `${path}${methodPath === '/' ? '' : methodPath}`;
    const router = injector.get(Router);
    router.add(method, _methodPath, async (injector: Injector) => {
        const instance = ref.create(injector);
        const handler = Reflect.get(instance, property)
        const res = await handler();
        const context = injector.get(HttpContext)
        const request = injector.get(HTTP_REQUEST)
        if (typeof res === 'string') {
            context.string(res)
        } else if (typeof res === 'object') {
            context.json(res)
        }
        request.respond(context.response)
    });
}
@Module({})
export class HttpModule {
    static forRoot(url: string): ModuleWithProviders {
        return {
            ngModule: HttpModule,
            providers: [
                HttpServerRequestHandler,
                {
                    provide: GetMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, GetOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'GET', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: PostMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, PostOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'POST', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: PutMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, PutOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'PUT', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: HeadMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, HeadOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'HEAD', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: PatchMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, PatchOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'PATCH', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: DeleteMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, DeleteOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'DELETE', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: ConnectMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, ConnectOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'CONNECT', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: OptionsMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, OptionsOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>, ...args: any[]) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'OPTIONS', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: TraceMetadataKey,
                    useValue: (injector: Injector, method: IMethodDecorator<any, TraceOptions>, parent: IClassDecorator<any, ControllerOptions>, ref: NgerRef<any>) => {
                        const options = parent.options;
                        const methodOptions = method.options;
                        register(method.property as string, 'TRACE', options, methodOptions, injector, ref)
                    }
                },
                {
                    provide: ContextMetadataKey,
                    useValue: (method: any, parameters: any[], instance: any, injector: Injector, param: IParameterDecorator) => {
                        const context = injector.get(HttpContext);
                        Reflect.set(parameters, param.parameterIndex, context)
                    }
                },
                {
                    provide: Router,
                    useFactory: () => new Router()
                },
                {
                    provide: HTTP_URL,
                    useValue: url
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: (injector: Injector) => {
                        return async () => {
                            const server = injector.get(Server);
                            const handler = injector.get(HttpServerRequestHandler)
                            for await (const req of server) {
                                const cookies = getCookies(req);
                                const reqInjector = injector.create([{
                                    provide: URLSearchParams,
                                    useFactory: (injector: Injector) => {
                                        return injector.get(URL).searchParams
                                    },
                                    deps: [Injector]
                                }, {
                                    provide: URL,
                                    useFactory: () => new URL(req.url, `http://0.0.0.0`)
                                }, {
                                    provide: HTTP_REQUEST,
                                    useValue: req
                                }, {
                                    provide: HTTP_COOKIES,
                                    useValue: cookies
                                }])
                                const httpInjector = reqInjector.create([{
                                    provide: HttpContext,
                                    useFactory: (injector: Injector) => new HttpContext(injector),
                                    deps: [Injector]
                                }])
                                handler.handle(httpInjector);
                            }
                        }
                    },
                    deps: [Injector],
                    multi: true
                },
                {
                    provide: Server,
                    useFactory: (injector: Injector) => {
                        const url = injector.get(HTTP_URL, '');
                        const server = serve(url);
                        return server;
                    },
                    deps: [Injector]
                }
            ]
        }
    }
}
