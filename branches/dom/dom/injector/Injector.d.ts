import { EvalExp } from 'olympus-r/engine/bind/Utils';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * 负责注入的模块
*/
export declare function DOMMediatorClass(moduleName: string, skin: string, ...skins: string[]): ClassDecorator;
/**
 * 一次绑定多个className
 *
 * @export
 * @param {{[path:string]:{[name:string]:EvalExp}}} uiDict 寻址表达式字典
 * @returns {PropertyDecorator}
 */
export declare function BindCSS(uiDict: {
    [path: string]: {
        [name: string]: EvalExp;
    };
}): PropertyDecorator;
/**
 * 一次绑定一个className
 *
 * @export
 * @param {string} path ui属性路径
 * @param {{[name:string]:EvalExp}} classDict 一个字典，key是className的值，value是判断表达式
 * @returns {PropertyDecorator}
 */
export declare function BindCSS(path: string, classDict: {
    [name: string]: EvalExp;
}): PropertyDecorator;
/**
 * 绑定当前对象的className
 *
 * @export
 * @param {{[name:string]:EvalExp}} classDict 一个字典，key是className的值，value是判断表达式
 * @returns {PropertyDecorator}
 */
export declare function BindCSS(classDict: {
    [name: string]: EvalExp;
}): PropertyDecorator;
