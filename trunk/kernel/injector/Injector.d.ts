import "reflect-metadata";
import { EvalExp } from '../bind/Utils';
import IComponent from '../interfaces/IComponent';
import IComponentConstructor from '../interfaces/IComponentConstructor';
import * as BindUtil from "./BindUtil";
export declare function addSubHandler(instance: IComponent, handler: (instance?: IComponent) => void): void;
export declare function isComponent(target: any): boolean;
/** 定义组件，支持数据绑定功能 */
export declare function ComponentClass(): ClassDecorator;
/** 添加子Component */
export declare function SubComponent(dataExp?: string): PropertyDecorator;
export declare function SubComponent(compCls: IComponentConstructor, dataExp?: string): PropertyDecorator;
export declare function SubComponent(skin: any, compCls?: IComponentConstructor, dataExp?: string): PropertyDecorator;
export declare function SubComponent(prototype: any, propertyKey: string): void;
export declare function listenOnOpen(prototype: any, before?: (comp: IComponent) => void, after?: (comp: IComponent) => void): void;
/**
 * 获取显示对象在comp.skin中的嵌套层级
 *
 * @param {IComponent} comp 中介者
 * @param {*} target 目标显示对象
 * @returns {number}
 */
export declare function getDepth(comp: IComponent, target: any): number;
export declare function searchUIDepth(values: any, comp: IComponent, target: any, callback: (currentTarget: any, target: any, key: string, value: any, leftHandlers?: BindUtil.IStopLeftHandler[], index?: number) => void, addressing?: boolean): void;
/**
 * 一次绑定多个属性
 *
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindValue(uiDict: {
    [path: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定一个属性
 *
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindValue(path: string, exp: EvalExp): PropertyDecorator;
/**
 * 只执行表达式，不赋值
 *
 * @export
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindExp(exp: EvalExp): PropertyDecorator;
/**
 * 只执行表达式，不赋值
 *
 * @export
 * @param {EvalExp[]} exps 表达式或方法数组
 * @returns {PropertyDecorator}
 */
export declare function BindExp(exps: EvalExp[]): PropertyDecorator;
export interface BindFuncDict {
    [path: string]: (EvalExp) | (EvalExp)[] | undefined | BindFuncDict;
}
/**
 * 一次绑定多个方法
 *
 * @export
 * @param {BindFuncDict} funcDict ui方法和表达式或方法字典
 * @returns {PropertyDecorator}
 */
export declare function BindFunc(funcDict: BindFuncDict): PropertyDecorator;
/**
 * 一次绑定一个方法
 *
 * @export
 * @param {string} path ui方法路径
 * @param {(EvalExp)|(EvalExp)[]} [exp] 参数表达式或参数表达式数组
 * @returns {PropertyDecorator}
 */
export declare function BindFunc(path: string, exp?: (EvalExp) | (EvalExp)[]): PropertyDecorator;
/**
 * 一次绑定多个事件
 *
 * @export
 * @param {{[type:string]:any}} evtDict 事件类型和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindOn(evtDict: {
    [type: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定一个事件
 *
 * @export
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindOn(type: string, exp: EvalExp): PropertyDecorator;
/**
 * 为指定对象一次绑定一个事件
 *
 * @export
 * @param {string} path ui属性路径
 * @param {string} type 事件类型
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindOn(path: string, type: string, exp: EvalExp): PropertyDecorator;
/**
 * 一次绑定多个显示判断
 *
 * @export
 * @param {{[path:string]:any}} uiDict ui属性路径和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindIf(uiDict: {
    [path: string]: any;
}): PropertyDecorator;
/**
 * 一次绑定一个显示判断
 *
 * @export
 * @param {string} path ui属性路径
 * @param {EvalExp} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindIf(path: string, exp: EvalExp): PropertyDecorator;
/**
 * 绑定当前显示对象的显示判断
 *
 * @export
 * @param {string} exp 表达式或方法
 * @returns {PropertyDecorator}
 */
export declare function BindIf(exp: EvalExp): PropertyDecorator;
/**
 * 一次绑定多个数据集合，如果要指定当前显示对象请使用$target作为key
 *
 * @export
 * @param {{[name:string]:any}} uiDict ui属性和表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindFor(uiDict: {
    [name: string]: any;
}): PropertyDecorator;
/**
 * 绑定数据集合到当前显示对象
 *
 * @export
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator}
 */
export declare function BindFor(exp: string, compCls?: IComponentConstructor, dataExp?: string): PropertyDecorator;
/**
 * 绑定数据集合到指定对象
 *
 * @export
 * @param {string} name ui属性名称
 * @param {string} exp 遍历表达式，形如："a in b"（a遍历b的key）或"a of b"（a遍历b的value）
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的中介者包装每一个渲染器
 * @param {string} [dataExp] 传递给中介者的数据表达式
 * @returns {PropertyDecorator}
 */
export declare function BindFor(name: string, exp: string, compCls?: IComponentConstructor, dataExp?: string): PropertyDecorator;
