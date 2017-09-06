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
    @Inject(Olympus.Core)
    public core:Olympus.Core;
}

class Fuck2
{
    @Inject(Fuck)
    public fuck:Fuck;

    @Inject(Olympus.Core)
    public core:Olympus.Core;

    @Inject(Olympus.Explorer)
    public explorer:Olympus.Explorer;

    @Inject(Olympus.Query)
    public query:Olympus.Query;

    @Inject(Olympus.External)
    public external:Olympus.External;

    @Inject(Olympus.Hash)
    public hash:Olympus.Hash;
}

var fuck2:Fuck2 = new Fuck2();
window["fuck2"] = fuck2;
console.log(fuck2);