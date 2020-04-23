import { createMethodDecorator, createParameterDecorator } from '../../decorator/index.ts'

export const PostMetadataKey = `@nger/http PostMetadataKey`

export interface PostOptions {
    path: string;
}
export const Post = createMethodDecorator<string | PostOptions>(PostMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})

export const GetMetadataKey = `@nger/http GetMetadataKey`
export interface GetOptions {
    path: string;
}
export const Get = createMethodDecorator<string | GetOptions>(GetMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const PutMetadataKey = `@nger/http PutMetadataKey`
export interface PutOptions {
    path: string;
}
export const Put = createMethodDecorator<string | GetOptions>(PutMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const HeadMetadataKey = `@nger/http HeadMetadataKey`
export interface HeadOptions {
    path: string;
}
export const Head = createMethodDecorator<string | HeadOptions>(HeadMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const PatchMetadataKey = `@nger/http PatchMetadataKey`
export interface PatchOptions {
    path: string;
}
export const Patch = createMethodDecorator<string | PatchOptions>(PatchMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const DeleteMetadataKey = `@nger/http DeleteMetadataKey`
export interface DeleteOptions {
    path: string;
}
export const Delete = createMethodDecorator<string | DeleteOptions>(DeleteMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const ConnectMetadataKey = `@nger/http ConnectMetadataKey`
export interface ConnectOptions {
    path: string;
}
export const Connect = createMethodDecorator<string | ConnectOptions>(ConnectMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const OptionsMetadataKey = `@nger/http OptionsMetadataKey`
export interface OptionsOptions {
    path: string;
}
export const Options = createMethodDecorator<string | OptionsOptions>(OptionsMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})


export const TraceMetadataKey = `@nger/http TraceMetadataKey`
export interface TraceOptions {
    path: string;
}
export const Trace = createMethodDecorator<string | TraceOptions>(TraceMetadataKey, it => {
    const options = it.options;
    if (typeof options === 'string') {
        it.options = {
            path: options
        }
    } else if (options) {
        it.options = options;
    } else {
        it.options = {
            path: '/'
        }
    }
})

export const ContextMetadataKey = `@nger/http ContextMetadataKey`
export const Context = createParameterDecorator(ContextMetadataKey)
