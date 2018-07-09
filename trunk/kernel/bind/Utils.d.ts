import Dictionary from '../../utils/Dictionary';
import IComponent from '../interfaces/IComponent';
import IComponentConstructor from '../interfaces/IComponentConstructor';
import Bind from './Bind';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-06
 * @modify date 2017-11-06
 *
 * 绑定工具类
*/
export interface EvalFunc {
    (...scopes: any[]): any;
}
export declare type EvalExp = string | EvalFunc;
/**
 * 创建一个执行方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export declare function createRunFunc(exp: EvalExp, scopeCount?: number): EvalFunc;
/**
 * 直接执行表达式，不求值。该方法可以执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 */
export declare function runExp(exp: EvalExp, thisArg?: any, ...scopes: any[]): void;
/**
 * 创建一个表达式求值方法，用于未来执行
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {number} [scopeCount=0] 所需的域的数量
 * @returns {EvalFunc} 创建的方法
 */
export declare function createEvalFunc(exp: EvalExp, scopeCount?: number): EvalFunc;
/**
 * 表达式求值，无法执行多条语句
 *
 * @export
 * @param {(EvalExp)} exp 表达式或方法
 * @param {*} [thisArg] this指向
 * @param {...any[]} scopes 表达式的作用域列表
 * @returns {*} 返回值
 */
export declare function evalExp(exp: EvalExp, thisArg?: any, ...scopes: any[]): any;
export declare const bindDict: Dictionary<IComponent, BindData>;
/**
 * 绑定数据到UI上
 *
 * @param {IComponent} comp 组件
 * @returns {Bind} 返回绑定实例
 * @memberof BindManager
 */
export declare function bind(comp: IComponent): Bind;
/**
 * 移除绑定
 *
 * @param {IComponent} comp
 * @returns {Bind}
 * @memberof BindManager
 */
export declare function unbind(comp: IComponent): Bind;
export interface BindData {
    bind: Bind;
    callbacks: (() => void)[];
}
/**
 * 绑定属性值
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的属性名
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export declare function bindValue(comp: IComponent, currentTarget: any, target: any, envModels: any[], name: string, exp: EvalExp): void;
/**
 * 绑定一个表达式，与bindValue类似，但不会给属性赋值
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {(EvalExp)} exp 绑定的表达式或方法
 * @memberof BindManager
 */
export declare function bindExp(comp: IComponent, currentTarget: any, target: any, envModels: any[], exp: EvalExp): void;
/**
 * 绑定方法执行
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定的方法名
 * @param {...(EvalExp)[]} argExps 执行方法的参数表达式或方法列表
 * @memberof BindManager
 */
export declare function bindFunc(comp: IComponent, currentTarget: any, target: any, envModels: any[], name: string, ...argExps: (EvalExp)[]): void;
/**
 * 绑定事件
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} type 绑定的事件类型
 * @param {EvalExp} exp 绑定的事件回调表达式或方法
 * @memberof BindManager
 */
export declare function bindOn(comp: IComponent, currentTarget: any, target: any, envModels: any[], type: string, exp: EvalExp): void;
/**
 * 绑定显示
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {EvalExp} exp 绑定表达式或方法
 * @param {(value:boolean)=>void} [callback] 判断条件改变时会触发这个回调
 * @memberof BindManager
 */
export declare function bindIf(comp: IComponent, currentTarget: any, target: any, envModels: any[], exp: EvalExp, callback?: (value: boolean) => void): void;
/**
 * 绑定循环
 *
 * @param {IComponent} comp 组件
 * @param {*} currentTarget 绑定到的target实体对象
 * @param {*} target 绑定命令本来所在的对象
 * @param {any[]} envModels 环境变量数组
 * @param {string} name 绑定本来所在的对象在Component中的名字
 * @param {string} exp 循环表达式，形如："a in b"（表示a遍历b中的key）或"a of b"（表示a遍历b中的值）。b可以是个表达式
 * @param {IComponentConstructor} [compCls] 提供该参数将使用提供的组件包装每一个渲染器
 * @param {IComponentConstructor} [declaredComponentCls] 声明的Component类型
 * @param {string} [dataExp] 提供给组件包装器的数据表达式
 * @param {(data:any, renderer:any, envModels:any[])=>void} [callback] 每次生成新的renderer实例时调用这个回调
 * @memberof BindManager
 */
export declare function bindFor(comp: IComponent, currentTarget: any, target: any, envModels: any[], name: string, exp: string, compCls?: IComponentConstructor, declaredComponentCls?: IComponentConstructor, dataExp?: string, callback?: (data: any, renderer: any, envModels: any[]) => void): void;
