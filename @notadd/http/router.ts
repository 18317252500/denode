
import { HandlerFunc } from "./types.ts";
import { Node } from './node.ts'
import { Injector } from "../di/index.ts";

export class Router {
    trees: Record<string, Node> = {};
    add(method: string, path: string, h: HandlerFunc): void {
        if (path[0] !== "/") {
            path = `/${path}`;
        }
        let root = this.trees[method];
        if (!root) {
            root = new Node();
            this.trees[method] = root;
        }
        root.addRoute(path, h);
    }
    find(method: string, injector: Injector): HandlerFunc | undefined {
        const url = injector.get(URL)
        const node = this.trees[method];
        if (node) {
            const [handle, params, _] = node.getValue(url.pathname);
            return handle;
        }
    }
}
