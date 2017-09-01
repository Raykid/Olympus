/// <reference path="../dist/Olympus.d.ts"/>

import Context from "core/context/Context"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * 测试项目
*/

Context.listen("fuck", handler, "this");

Context.dispatch("fuck");

function handler(msg:any):void
{
    Context.unlisten("fuck", handler, this);
    console.log(this, msg);
}