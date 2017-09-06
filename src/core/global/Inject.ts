/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
namespace global
{
    export interface IConstructor extends Function
    {
        new (...args:any[]):any;
    }
    
    export interface IInjectableParams
    {
        type:IConstructor;
    }

    export class Inject
    {
        private static _injectDict:{[key:string]:any} = {};
        
        /**
         * 获取注入字典
         * 
         * @static
         * @returns {{[key:string]:any}} 
         * @memberof Inject
         */
        public static getInjectDict():{[key:string]:any}
        {
            return Inject._injectDict;
        }
    
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         * 
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @static
         * @memberof Inject
         */
        public static mapInject(target:IConstructor, type?:IConstructor):void
        {
            var value:any = new target();
            Inject.mapInjectValue(value, type);
        }
    
        /**
         * 注入一个对象实例
         * 
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @static
         * @memberof Inject
         */
        public static mapInjectValue(value:any, type?:IConstructor):void
        {
            var key:string = (type || value.constructor).toString();
            Inject._injectDict[key] = value;
        }
    
        /**
         * 移除类型注入
         * 
         * @param {IConstructor} target 要移除注入的类型
         * @static
         * @memberof Inject
         */
        public static unmapInject(target:IConstructor):void
        {
            var key:string = target.toString();
            delete Inject._injectDict[key];
        }
    
        /**
         * 获取注入的对象实例
         * 
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @static
         * @memberof Inject
         */
        public static getInject(type:IConstructor):any
        {
            return Inject._injectDict[type.toString()];
        }
    }
}