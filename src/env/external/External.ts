/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 * 
 * External类为window.external参数字典包装类
*/
export default class External
{
    private _params:{[key:string]:any} = {};

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