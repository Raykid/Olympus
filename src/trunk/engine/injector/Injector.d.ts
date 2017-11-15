import { IResponseDataConstructor } from "../net/ResponseData";
import IModuleConstructor from "../module/IModuleConstructor";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 *
 * 负责注入的模块
*/
/** 定义数据模型，支持实例注入，并且自身也会被注入 */
export declare function ModelClass(...args: any[]): any;
/** 定义界面中介者，支持实例注入，并可根据所赋显示对象自动调整所使用的表现层桥 */
export declare function MediatorClass(cls: IConstructor): IConstructor;
/** 定义模块，支持实例注入 */
export declare function ModuleClass(cls: IModuleConstructor): IConstructor;
/** 处理模块消息 */
export declare function ModuleMessageHandler(prototype: any, propertyKey: string): void;
export declare function ModuleMessageHandler(type: string): MethodDecorator;
/** 处理通讯消息返回 */
export declare function ResponseHandler(prototype: any, propertyKey: string): void;
export declare function ResponseHandler(cls: IResponseDataConstructor): MethodDecorator;
/** 在Module内托管Mediator */
export declare function DelegateMediator(prototype: any, propertyKey: string): any;
/**
 * 一次绑定多个属性
 *
 * @export
 * @param {{[name:string]:string}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindValue(uiDict: {
    [name: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定一个属性
 *
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 表达式
 * @returns {PropertyDecorator}
 */
export declare function BindValue(name: string, exp: string): PropertyDecorator;
/**
 * 一次绑定多个事件
 *
 * @export
 * @param {{[type:string]:string}} evtDict 事件类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindOn(evtDict: {
    [type: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定一个事件
 *
 * @export
 * @param {string} type 事件类型
 * @param {string} exp 表达式
 * @returns {PropertyDecorator}
 */
export declare function BindOn(type: string, exp: string): PropertyDecorator;
/**
 * 一次绑定多个显示判断，如果要指定当前显示对象请使用$target作为key
 *
 * @export
 * @param {{[name:string]:string}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindIf(uiDict: {
    [name: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定一个显示判断
 *
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 表达式
 * @returns {PropertyDecorator}
 */
export declare function BindIf(name: string, exp: string): PropertyDecorator;
/**
 * 绑定当前对象的显示判断
 *
 * @export
 * @param {string} exp 表达式
 * @returns {PropertyDecorator}
 */
export declare function BindIf(exp: string): PropertyDecorator;
/**
 * 一次绑定多个全局消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindMessage(msgDict: {
    [type: string]: {
        [name: string]: string;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个全局消息
 *
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindMessage(type: IConstructor | string, uiDict: {
    [name: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定多个模块消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:string}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindModuleMessage(msgDict: {
    [type: string]: {
        [name: string]: string;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个模块消息
 *
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindModuleMessage(type: IConstructor | string, uiDict: {
    [name: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定多个全局通讯消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindResponse(resDict: {
    [type: string]: {
        [name: string]: string;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个全局通讯消息
 *
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindResponse(type: IResponseDataConstructor | string, uiDict: {
    [name: string]: string;
}): PropertyDecorator;
/**
 * 一次绑定多个模块通讯消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:string}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindModuleResponse(resDict: {
    [type: string]: {
        [name: string]: string;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个模块通讯消息
 *
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindModuleResponse(type: IResponseDataConstructor | string, uiDict: {
    [name: string]: string;
}): PropertyDecorator;
