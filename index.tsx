import { Module, corePlatform, Injectable, Controller, Get, Post, Put, Context } from './denode/core.ts'
import { HttpModule, HttpContext, MIME } from './denode/http/index.ts'
import { React } from 'https://gitee.com/meepo_vip/denode/raw/master/denode/react.ts';
import marked from './denode/marked/index.ts'
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

  @Get('docs')
  indexMarked(@Context() context: HttpContext) {
    const res = marked.parse(`
## demo
    `)
    context.writeContentType(MIME.TextHTML)
    return res;
    context.html(res)
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
