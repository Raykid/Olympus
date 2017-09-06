/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 * 
 * 这是表现层接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IView
{
    /**
     * 获取表现层类型名称
     * @return {string} 一个字符串，代表表现层类型名称
     */
    getType():string;
    /**
     * 获取表现层HTML包装器，可以对其样式进行自定义调整
     * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
     */
    getHTMLWrapper():HTMLElement;
    /**
     * 初始化表现层
     * @param {()=>void} complete 初始化完毕后的回调
     */
    initView(complete:()=>void):void;
}