declare module "trunk/view/bridge/IBridge" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
    */
    export default interface IBridge {
        /**
         * 获取表现层类型名称
         *
         * @return {string} 一个字符串，代表表现层类型名称
         * @memberof IBridge
         */
        getType(): string;
        /**
         * 判断传入的skin是否是属于该表现层桥的
         *
         * @param {*} skin 皮肤实例
         * @return {boolean} 是否数据该表现层桥
         * @memberof IBridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
         * @memberof IBridge
         */
        getHTMLWrapper(): HTMLElement;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         *
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof IBridge
         */
        init?(complete: (bridge: IBridge) => void): void;
    }
}
declare module "trunk/utils/ObjectUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 对象工具集
    */
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    export function extendObject(target: any, ...sources: any[]): any;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    export function cloneObject(target: any, deep?: boolean): any;
    /**
     * 生成一个随机ID
     */
    export function getGUID(): string;
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    export function getAutoIncId(type: string): string;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    export function isEmpty(obj: any): boolean;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    export function trimData(data: any): any;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    export var extendsClass: (child: any, parent: any) => void;
    /**
     * 获取一个对象的对象哈希字符串
     *
     * @export
     * @param {*} target 任意对象，可以是基础类型或null
     * @returns {string} 哈希值
     */
    export function getObjectHash(target: any): string;
    /**
     * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
     *
     * @export
     * @param {...any[]} targets 希望获取哈希值的对象列表
     * @returns {string} 多个对象共同作用下的哈希值
     */
    export function getObjectHashs(...targets: any[]): string;
}
declare module "branches/dom/Bridge" {
    import IBridge from "trunk/view/bridge/IBridge";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * 基于DOM的表现层桥实现
    */
    export default class Bridge implements IBridge {
        /**
         * 获取表现层类型名称
         * @return {string} 一个字符串，代表表现层类型名称
         * @memberof IBridge
         */
        getType(): string;
        private _root;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
         * @memberof IBridge
         */
        getHTMLWrapper(): HTMLElement;
        /**
         * 判断皮肤是否是DOM显示节点
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是DOM显示节点
         * @memberof Bridge
         */
        isMySkin(skin: any): boolean;
        constructor(root?: HTMLElement | string);
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof IBridge
         */
        init(complete: (bridge: IBridge) => void): void;
        private _listenerDict;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {HTMLElement} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        mapListener(target: HTMLElement, type: string, handler: (evt: Event) => void, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {HTMLElement} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IBridge
         */
        unmapListener(target: HTMLElement, type: string, handler: (evt: Event) => void, thisArg?: any): void;
    }
}
