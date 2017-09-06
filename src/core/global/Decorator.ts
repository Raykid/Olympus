/// <reference path="Inject.ts"/>

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
function Inject(cls:global.IConstructor):PropertyDecorator
{
    return function(prototype:any, propertyKey:string):PropertyDescriptor
    {
        return {
            get: ()=>global.Inject.getInject(cls)
        };
    };
}

function Injectable(cls:global.IConstructor):void
function Injectable(cls:global.IInjectableParams):ClassDecorator
function Injectable(cls:global.IInjectableParams|global.IConstructor):ClassDecorator|void
{
    var params:global.IInjectableParams = cls as global.IInjectableParams;
    if(params.type instanceof Function)
    {
        // 需要转换注册类型，需要返回一个ClassDecorator
        return function(realCls:global.IConstructor):void
        {
            global.Inject.mapInject(realCls, params.type);
        } as ClassDecorator;
    }
    else
    {
        // 不需要转换注册类型，直接注册
        global.Inject.mapInject(cls as global.IConstructor);
    }
}