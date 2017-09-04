/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
declare function Inject(cls:IConstructor):PropertyDecorator;
declare function Injectable(cls:IConstructor):void;
declare function Injectable(cls:IInjectableParams):ClassDecorator;

declare interface IConstructor extends Function
{
    new (...args:any[]):any;
}

declare interface IInjectableParams
{
    type:IConstructor;
}