import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 * 
 * External类为window.external参数字典包装类
*/
@Injectable
export default class WindowExternal
{
    private _params:{[key:string]:any} = {};

    /**
     * 获取全部window.external参数
     * 
     * @readonly
     * @type {{[key:string]:string}}
     * @memberof WindowExternal
     */
    public get params():{[key:string]:string}
    {
        return this._params;
    }

    public constructor()
    {
        // 处理window.external
        try
        {
            if(!(window.external && typeof window.external === "object"))
            {
                (window as any).external = {};
            }
        }
        catch (err)
        {
            (window as any).external = {};
        }
        this._params = window.external;
    }

    /**
     * 获取window.external中的参数
     * 
     * @param {string} key 参数名
     * @returns {*} 参数值
     * @memberof External
     */
    public getParam(key:string):any
    {
        return this._params[key];
    }
}
/** 再额外导出一个单例 */
export const windowExternal:WindowExternal = core.getInject(WindowExternal);