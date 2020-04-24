import {
    Controller,
    Get,
    Context,
    Css
} from "../denode/core.ts";
import { DemoService } from './demo.service.ts'
import { HttpContext } from "../denode/http/index.ts";
import marked from "../denode/marked/index.ts";
import {
    React
  } from "https://gitee.com/meepo_vip/denode/raw/master/denode/react.ts";
@Controller('/')
export class DemoController {
    constructor(private demo: DemoService) { }
    @Get()
    index(@Context() context: HttpContext): any {
        context.setCookie({
            name: 'demo',
            value: 'demo2'
        });
        const style = {
            color: 'red'
        }
        return <h1 style={style}>
            hello index get 
            <script src="./1.js"></script>
        </h1>
    }

    @Get('react')
    react(@Context() context: HttpContext): any {
        context.setCookie({
            name: 'demo',
            value: 'demo2'
        });
        return <div>
            <h1>hello react!</h1>
            <a href="docs">docs</a>
        </div>
    }

    @Get('docs')
    docs(@Context() context: HttpContext) {
        const res = marked.parse(`## demo`)
        return <div>
            <h1>hello docs! </h1>
            <a href = "react" > react </a>
            <div dangerouslySetInnerHTML={{__html: res}}> </div>
        </div>
    }

    @Css('css')
    css() {
        return `
body{

    background-colro: red;
}
        `
    }
}
