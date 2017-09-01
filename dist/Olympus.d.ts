declare module "core/context/ContextMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息接口
    */
    export interface IContextMessage {
        /**
         * 获取消息类型
         *
         * @returns {string} 消息类型
         * @memberof IContextMessage
         */
        getType(): string;
    }
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    export default class ContextMessage implements IContextMessage {
        private _type;
        getType(): string;
        /**
         * 消息参数列表
         *
         * @type {any[]}
         * @memberof ContextMessage
         */
        params: any[];
        /**
         * Creates an instance of ContextMessage.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof ContextMessage
         */
        constructor(type: string, ...params: any[]);
    }
}
declare module "core/context/Context" {
    import { IContextMessage } from "core/context/ContextMessage";
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Context
     */
    export class Context {
        private static _instance;
        private _listenerDict;
        constructor();
        /**
         * 派发内核消息
         *
         * @param {IContextMessage} msg 内核消息实例
         * @memberof Context
         */
        dispatch(msg: IContextMessage): void;
        /**
         * 派发内核消息，消息会转变为ContextMessage类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Context
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        listen(type: string, handler: (msg: IContextMessage) => void, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @
         * @param {string} type 消息类型
         * @param {(msg:IContextMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Context
         */
        unlisten(type: string, handler: (msg: IContextMessage) => void, thisArg?: any): void;
    }
    const _default: Context;
    export default _default;
}
declare module "core/view/IView" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 这是表现层接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
    */
    export default interface IView {
        /**
         * 获取表现层类型名称
         * @return {string} 一个字符串，代表表现层类型名称
         */
        getType(): string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         * @return {HTMLElement} 表现层的HTML包装器，通常会是一个<div/>标签
         */
        getHTMLWrapper(): HTMLElement;
        /**
         * 初始化表现层
         * @param {()=>void} complete 初始化完毕后的回调
         */
        initView(complete: () => void): void;
    }
}
declare module "Olympus" {
    import IView from "core/view/IView";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * 这是Olympus框架的外观类，绝大多数与Olympus框架的交互都可以通过这个类解决
    */
    export default class Olympus {
        /**
         * 添加一个表现层实例到框架中
         *
         * @static
         * @param {IView} view 要添加的表现层实例
         * @param {string} [name] 为此表现层实例起名
         * @memberof Olympus
         */
        static addView(view: IView, name?: string): void;
    }
}
