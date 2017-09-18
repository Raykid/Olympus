/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-13
 * @modify date 2017-09-13
 * 
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/

interface IConstructor extends Function
{
    new (...args:any[]):any;
}

/**
 * 标识当前类型是个Module，Module与Mediator类似，具有装饰器注入功能，但自身不会被注入
 * 
 * @param {IConstructor} cls 要注入的Module类
 * @returns {*} 
 */
declare function module(cls:IConstructor):IConstructor;