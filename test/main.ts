/// <reference path="../dist/Olympus.d.ts"/>

import * as Olympus from "Olympus"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 测试项目
*/
Olympus.listen("fuck", handler, "this");

Olympus.dispatch("fuck");

function handler(msg:Olympus.IMessage):void
{
    Olympus.unlisten("fuck", handler, this);
}


@Injectable
class Fuck
{
    private _fuck:string;
}

class Fuck2
{
    @Inject(Fuck)
    public fuck:Fuck;

    @Inject(Olympus.Context)
    public ctx:Olympus.Context;
}

var fuck2:Fuck2 = new Fuck2();
console.log(fuck2.fuck, fuck2.ctx);