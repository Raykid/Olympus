/// <reference path="../../core/global/IConstructor.ts"/>

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/

interface IInjectableParams
{
    type:IConstructor;
}

/**
 * 生成一个类型的实例并注册到框架注入器中，默认注册到自身类型构造器上
 * 
 * @param {IConstructor} cls 要注入的类
 */
declare function injectable(cls:IConstructor):void;

/**
 * 生成一个类型的实例并注册到框架注入器中，注册到指定的类型构造器上
 * 
 * @param {IInjectableParams} params 指定要注册到到的类型构造器
 * @returns {*} 
 */
declare function injectable(params:IInjectableParams):any;

/**
 * 标识当前类型是个Model，Model具有装饰器注入功能，且自身也会被注入(Injectable功能)
 * 
 * @param {IConstructor} cls 要注入的Model类
 * @returns {*} 替换的构造函数
 */
declare function model(cls:IConstructor):any;

/**
 * 标识当前类型是个Mediator，Mediator具有装饰器注入功能，但自身不会被注入
 * 
 * @param {IConstructor} cls 要注入的Mediator类
 * @returns {*} 替换的构造函数
 */
declare function mediator(cls:IConstructor):any;

/**
 * 注入一个类型的实例
 * 
 * @param {IConstructor} cls 类型构造器
 * @returns {PropertyDecorator} 
 */
declare function inject(cls:IConstructor):PropertyDecorator;

/**
 * 消息处理函数的装饰器方法
 * 
 * @param {string} type 监听的消息类型
 * @returns {MethodDecorator} 
 */
declare function handler(type:string):MethodDecorator;