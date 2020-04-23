import { InjectionToken } from '../core/index.ts'
import { ServerRequest, Cookies } from "../deno/index.ts";

export const HTTP_URL = new InjectionToken<string>(`@nger/http HTTP_URL`)
export const HTTP_REQUEST = new InjectionToken<ServerRequest>(`@nger/http HTTP_REQUEST`)
export const HTTP_COOKIES = new InjectionToken<Cookies>(`@nger/http HTTP_COOKIES`)
export const HTTP_BODY = new InjectionToken<Cookies>(`@nger/http HTTP_BODY`)
export const HTTP_URL_OBJECT = new InjectionToken<URL>(`@nger/http HTTP_URL_OBJECT`)
