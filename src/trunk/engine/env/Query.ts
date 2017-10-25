import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 * 
 * Query类记录通过GET参数传递给框架的参数字典
*/
@Injectable
export default class Query
{
    private _params:{[key:string]:string};

    /**
     * 获取全部Query参数
     * 
     * @readonly
     * @type {{[key:string]:string}}
     * @memberof Query
     */
    public get params():{[key:string]:string}
    {
        return this._params;
    }

    public constructor()
    {
        this._params = {};
        var query: string = window.location.search.substr(1);
        var vars: string[] = query.split('&');
        for (var i: number = 0, len: number = vars.length; i < len; i++)
        {
            var pair: string[] = vars[i].split('=', 2);
            if (pair.length != 2 || !pair[0]) continue;
            var name: string = pair[0];
            var value: string = pair[1];
            name = decodeURIComponent(name);
            value = decodeURIComponent(value);
            // decode twice for ios
            name = decodeURIComponent(name);
            value = decodeURIComponent(value);
            this._params[name] = value;
        }
    }

    /**
     * 获取GET参数
     * 
     * @param {string} key 参数key
     * @returns {string} 参数值
     * @memberof Query
     */
    public getParam(key:string):string
    {
        return this._params[key];
    }
}
/** 再额外导出一个单例 */
export const query:Query = core.getInject(Query);