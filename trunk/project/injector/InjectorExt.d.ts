import { IResponseDataConstructor } from "../net/ResponseData";
/** 生成类型实例并注入，可以进行类型转换注入（即注入类型可以和注册类型不一致，采用@Injectable(AnotherClass)的形式即可） */
export declare function Injectable(...args: any[]): any;
/** 赋值注入的实例 */
export declare function Inject(prototype: any, propertyKey: string): void;
export declare function Inject(cls: any): PropertyDecorator;
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
export declare function MediatorClass(moduleName: string): ClassDecorator;
/** 处理消息 */
export declare function MessageHandler(prototype: any, propertyKey: string): void;
export declare function MessageHandler(type: string): MethodDecorator;
/** 处理全局消息 */
export declare function GlobalMessageHandler(prototype: any, propertyKey: string): void;
export declare function GlobalMessageHandler(type: string): MethodDecorator;
/** 处理通讯消息返回 */
export declare function ResponseHandler(prototype: any, propertyKey: string): void;
export declare function ResponseHandler(cls: IResponseDataConstructor): MethodDecorator;
/** 处理全局通讯消息返回 */
export declare function GlobalResponseHandler(prototype: any, propertyKey: string): void;
export declare function GlobalResponseHandler(cls: IResponseDataConstructor): MethodDecorator;
/**
 * 一次绑定多个消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:any}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindMessage(msgDict: {
    [type: string]: {
        [name: string]: any;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个消息
 *
 * @export
 * @param {IConstructor|string} type 消息类型或消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindMessage(type: IConstructor | string, uiDict: {
    [name: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定多个全局消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:any}}} msgDict 消息类型和ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindGlobalMessage(msgDict: {
    [type: string]: {
        [name: string]: any;
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
export declare function BindGlobalMessage(type: IConstructor | string, uiDict: {
    [name: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定多个通讯消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:any}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindResponse(resDict: {
    [type: string]: {
        [name: string]: any;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个通讯消息
 *
 * @export
 * @param {IResponseDataConstructor|string} type 通讯消息类型或通讯消息类型名称
 * @param {string} uiDict ui表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindResponse(type: IResponseDataConstructor | string, uiDict: {
    [name: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定多个全局通讯消息
 *
 * @export
 * @param {{[type:string]:{[name:string]:any}}} resDict 通讯消息类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindGlobalResponse(resDict: {
    [type: string]: {
        [name: string]: any;
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
export declare function BindGlobalResponse(type: IResponseDataConstructor | string, uiDict: {
    [name: string]: any;
}): PropertyDecorator;
