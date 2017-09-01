import {context, Context} from "core/context/Context"
import {IView} from "core/view/IView"
import {IMessage, Message} from "core/message/Message"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-09-01
 * 
 * 这是Olympus框架的外观模块，绝大多数与Olympus框架的交互都可以通过这个模块解决
*/

/**
 * 添加一个表现层实例到框架中
 * 
 * @static
 * @param {IView} view 要添加的表现层实例
 * @param {string} [name] 为此表现层实例起名
 * @memberof Olympus
 */
export function addView(view:IView, name?:string):void
{
}

/** 导出常用的对象 */
export {context, Context, IView, IMessage, Message}