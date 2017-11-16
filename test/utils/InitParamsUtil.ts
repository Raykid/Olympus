import { windowExternal } from "engine/env/WindowExternal";
import { query } from "engine/env/Query";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 初始参数工具，先从windowExternal取，取不到再从query里取
*/
export default function getParam(key:string):any
{
    return (windowExternal.getParam(key) || query.getParam(key));
}