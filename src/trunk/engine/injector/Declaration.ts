/// <reference path="../../core/global/IConstructor.ts"/>

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * engine模组内所有装饰器的全局声明
*/
declare function ModelClass(cls:IConstructor):any;
declare function MediatorClass(cls:IConstructor):any;
declare function ModuleClass(cls:IConstructor):any;
declare function ResponseHandler(prototype:any, propertyKey:string):void
declare function ResponseHandler(cls:IConstructor):MethodDecorator
declare function DelegateMediator(prototype:any, propertyKey:string):any;