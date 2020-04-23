import { Type } from '../../di/index.ts';
export type PathParams = string | RegExp | Array<string | RegExp>;

export interface UsePipes {
    usePipes?: Type<any>[];
}

export interface UseGuards {
    useGuards?: Type<any>[];
}
