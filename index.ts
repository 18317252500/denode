import { Module, corePlatform, Injectable, Controller, Get, Post, Put, Context } from './@notadd/core/index.ts'
import { HttpModule, HttpContext } from './@notadd/http/index.ts'
import { Cookie } from './@notadd/deno/index.ts'
@Injectable()
export class DemoService { }

@Controller('/')
export class DemoController {
  constructor(private demo: DemoService) { }
  @Get()
  index(@Context() context: HttpContext) {
    context.setCookie({
      name: 'demo',
      value: 'demo2'
    });
    return `hello index get`
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