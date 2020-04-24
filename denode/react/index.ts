/// <reference path="https://deno.land/x/types/react/v16.13.1/react.d.ts" />
import { ReactElement } from 'https://deno.land/x/types/react/v16.13.1/react.d.ts';
import React from "https://dev.jspm.io/react";
import ReactDOMServer from "https://dev.jspm.io/react-dom/server";
export {
    React,
    ReactDOMServer
}
export const isValidElement: (val: any) => val is ReactElement = (React as any).isValidElement;
export const renderToString: (val: ReactElement) => string = (ReactDOMServer as any).renderToString;
