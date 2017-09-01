import Context from "core/context/Context"
import IView from "core/view/IView"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * 这是Olympus框架的外观类，绝大多数与Olympus框架的交互都可以通过这个类解决
*/
export default class Olympus
{
    /**
     * 添加一个表现层实例到框架中
     * 
     * @static
     * @param {IView} view 要添加的表现层实例
     * @param {string} [name] 为此表现层实例起名
     * @memberof Olympus
     */
    public static addView(view:IView, name?:string):void
    {
    }
}