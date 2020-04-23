export abstract class Config<K = string> {
    abstract get<T>(key: K, def: T): T;
}

export class DefaultConfig extends Config {
    get<T>(key: string, def: T): T {
        return def;
    }
}
