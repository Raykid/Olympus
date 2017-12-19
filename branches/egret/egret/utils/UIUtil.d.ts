/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-17
 * @modify date 2017-10-17
 *
 * UI工具集
*/
/**
 * 包装EUI的DataGroup组件，使用传入的处理函数处理每个渲染器更新的逻辑
 *
 * @export
 * @param {eui.DataGroup} group 被包装的DataGroup组件
 * @param {(data?:any, renderer?:any)=>void} rendererHandler 渲染器处理函数，每次数据更新时会被调用，处理单个渲染器的渲染逻辑
 * @param {(datas?:eui.ICollection, group?:eui.DataGroup)=>void} [updateHandler] 数据更新处理函数，每次显示更新时会被调用，处理列表显示更新后的渲染逻辑
 */
export declare function wrapEUIList(group: eui.DataGroup, rendererHandler: (data?: any, renderer?: any) => void, updateHandler?: (datas?: eui.ICollection, group?: eui.DataGroup) => void): void;
