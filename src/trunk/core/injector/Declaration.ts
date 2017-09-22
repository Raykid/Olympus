/// <reference path="../global/IConstructor.ts"/>

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * core模组内所有装饰器的全局声明
*/
declare function Injectable(cls:IConstructor):void;
declare function Injectable(name:string):ClassDecorator;
declare function Injectable(params:{type:IConstructor}):ClassDecorator;
declare function Inject(cls:IConstructor|string):PropertyDecorator;
declare function MessageHandler(type:string):MethodDecorator;