/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/

interface IConstructor extends Function
{
    new (...args:any[]):any;
}

interface IInjectableParams
{
    type:IConstructor;
}

/**
 * 注入一个类型的实例
 * 
 * @param {IConstructor} cls 类型构造器
 * @returns {PropertyDecorator} 
 */
declare function Inject(cls:IConstructor):PropertyDecorator;

/**
 * 生成一个类型的实例并注册到框架注入器中，默认注册到自身类型构造器上
 * 
 * @param {IConstructor} cls 类型构造器
 */
declare function Injectable(cls:IConstructor):void;
/**
 * 生成一个类型的实例并注册到框架注入器中，注册到指定的类型构造器上
 * 
 * @param {IInjectableParams} params 指定要注册到到的类型构造器
 * @returns {ClassDecorator} 
 */
declare function Injectable(params:IInjectableParams):ClassDecorator;

/**
 * 消息处理函数的装饰器方法
 * 
 * @param {string} type 监听的消息类型
 * @returns {MethodDecorator} 
 */
declare function Handler(type:string):MethodDecorator;

/**
 * 标识当前类型是个Model
 * 
 * @param {IConstructor} cls 
 * @returns {*} 
 */
declare function Model(cls:IConstructor):any;

/**
 * 标识当前类型是个Mediator
 * 
 * @param {IConstructor} cls 
 * @returns {*} 
 */
declare function Mediator(cls:IConstructor):any;