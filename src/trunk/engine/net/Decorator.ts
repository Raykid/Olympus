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
 * 通讯消息返回处理函数的装饰器方法
 * 
 * @param {(IConstructor|string)} clsOrType 消息返回体构造器或类型字符串
 * @returns {MethodDecorator} 
 */
declare function result(clsOrType:IConstructor|string):MethodDecorator;