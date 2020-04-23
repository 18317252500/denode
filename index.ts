import { Module, corePlatform, Injectable, Controller, Get, Post, Put } from './@notadd/core/index.ts'
import { HttpModule } from './@notadd/http/index.ts'

@Injectable()
export class DemoService { }

@Controller('/')
export class DemoController {
  constructor(private demo: DemoService) { }
  @Get()
  index() {
    console.log(`hello index`)
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