import { Module, corePlatform, Injectable, Controller, Get, Post, Put, Context } from 'https://gitee.com/meepo_vip/denode/raw/master/denode/core.ts'
import { HttpModule, HttpContext } from 'https://gitee.com/meepo_vip/denode/raw/master/denode/http/index.ts?t=2'
import { React } from 'https://gitee.com/meepo_vip/denode/raw/master/denode/react.ts';

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