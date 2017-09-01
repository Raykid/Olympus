/// <reference path="../dist/Olympus.d.ts"/>

import ctx from "core/context/Context"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 测试项目
*/

ctx.listen("fuck", handler, "this");

ctx.dispatch("fuck");

function handler(msg:any):void
{
    ctx.unlisten("fuck", handler, this);
    console.log(this, msg);
}