export abstract class PipeTransform<O> {
    abstract transform(old: any, ...args: any[]): O;
}
