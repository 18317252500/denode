## denode
> 一款基于deno的mvc框架

## 开始

```ts
import { Module, corePlatform, Injectable, Controller, Get, Post, Put, Context } from './denode/core/index.ts'
import { HttpModule, HttpContext } from './denode/http/index.ts'
import { React } from './denode/react/index.ts';

@Injectable()
export class DemoService { }

@Controller('/')
export class DemoController {
  constructor(private demo: DemoService) { }
  @Get()
  index(@Context() context: HttpContext):any {
    context.setCookie({
      name: 'demo',
      value: 'demo2'
    });
    return <h1>hello index get</h1>
  }

  @Post()
  indexPost() {
    return `hello index post`
  }

  @Put()
  indexPut() {
    return `hello index put`
  }
}

@Module({
  providers: [DemoService],
  controllers: [
    DemoController
  ],
  imports: [
    HttpModule.forRoot('0.0.0.0:8081')
  ]
})
export class AppModule { }

corePlatform().bootstrapModule(AppModule);
```