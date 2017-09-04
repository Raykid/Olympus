/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 * 
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
declare function Inject(cls:Constructor):PropertyDecorator;
declare function Injectable(cls:Constructor):void;
declare function Injectable(cls:InjectableParams):ClassDecorator;

declare interface Constructor extends Function
{
    new (...args:any[]):any;
}

declare interface InjectableParams
{
    type:Constructor;
}