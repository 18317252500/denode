import {
  Module,
  corePlatform
} from "./denode/core.ts";
import { HttpModule } from "./denode/http/index.ts";
import { DemoController } from "./demo/demo.controller.tsx";
import { DemoService } from "./demo/demo.service.ts";
@Module({
  providers: [DemoService],
  controllers: [
    DemoController
  ],
  imports: [
    HttpModule.forRoot("0.0.0.0:8081")
  ]
})
export class AppModule {

}
corePlatform().bootstrapModule(AppModule);
