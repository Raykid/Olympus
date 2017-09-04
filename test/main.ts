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
Olympus.context.listen("fuck", handler, "this");

Olympus.context.dispatch("fuck");

function handler(msg:Olympus.IMessage):void
{
    Olympus.context.unlisten("fuck", handler, this);
    console.log(this, msg.getType());

    console.log(function(){}.prototype);
    console.log(Olympus.Context.prototype);
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
}

console.log(new Fuck2().fuck);