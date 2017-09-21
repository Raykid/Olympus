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
         * @readonly
         * @type {string}
         * @memberof IBridge
         */
        readonly type: string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly htmlWrapper: HTMLElement;
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly root: any;
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly bgLayer: any;
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly sceneLayer: any;
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly panelLayer: any;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof IBridge
         */
        readonly topLayer: any;
        /**
         * 判断传入的skin是否是属于该表现层桥的
         *
         * @param {*} skin 皮肤实例
         * @return {boolean} 是否数据该表现层桥
         * @memberof IBridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 添加显示
         *
         * @param {*} parent 要添加到的父容器
         * @param {*} target 被添加的显示对象
         * @return {*} 返回被添加的显示对象
         * @memberof IBridge
         */
        addChild(parent: any, target: any): any;
        /**
         * 按索引添加显示
         *
         * @param {*} parent 要添加到的父容器
         * @param {*} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {*} 返回被添加的显示对象
         * @memberof IBridge
         */
        addChildAt(parent: any, target: any, index: number): any;
        /**
         * 移除显示对象
         *
         * @param {*} parent 父容器
         * @param {*} target 被移除的显示对象
         * @return {*} 返回被移除的显示对象
         * @memberof IBridge
         */
        removeChild(parent: any, target: any): any;
        /**
         * 按索引移除显示
         *
         * @param {*} parent 父容器
         * @param {number} index 索引
         * @return {*} 返回被移除的显示对象
         * @memberof IBridge
         */
        removeChildAt(parent: any, index: number): any;
        /**
         * 移除所有显示对象
         *
         * @param {*} parent 父容器
         * @memberof IBridge
         */
        removeChildren(parent: any): void;
        /**
         * 获取父容器
         *
         * @param {*} target 指定显示对象
         * @return {*} 父容器
         * @memberof IBridge
         */
        getParent(target: any): any;
        /**
         * 获取指定索引处的显示对象
         *
         * @param {*} parent 父容器
         * @param {number} index 指定父级索引
         * @return {*} 索引处的显示对象
         * @memberof IBridge
         */
        getChildAt(parent: any, index: number): any;
        /**
         * 获取显示索引
         *
         * @param {*} parent 父容器
         * @param {*} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof IBridge
         */
        getChildIndex(parent: any, target: any): number;
        /**
         * 通过名称获取显示对象
         *
         * @param {*} parent 父容器
         * @param {string} name 对象名称
         * @return {*} 显示对象
         * @memberof IBridge
         */
        getChildByName(parent: any, name: string): any;
        /**
         * 获取子显示对象数量
         *
         * @param {*} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof IBridge
         */
        getChildCount(parent: any): number;
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
         *
         * @readonly
         * @type {string}
         * @memberof Bridge
         */
        readonly type: string;
        private _root;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly htmlWrapper: HTMLElement;
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly root: HTMLElement;
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly bgLayer: HTMLElement;
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly sceneLayer: HTMLElement;
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly panelLayer: HTMLElement;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly topLayer: HTMLElement;
        constructor(root?: HTMLElement | string);
        /**
         * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof Bridge
         */
        init(complete: (bridge: IBridge) => void): void;
        /**
         * 判断皮肤是否是DOM显示节点
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是DOM显示节点
         * @memberof Bridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @return {Element} 返回被添加的显示对象
         * @memberof Bridge
         */
        addChild(parent: Element, target: Element): Element;
        /**
         * 按索引添加显示
         *
         * @param {Element} parent 要添加到的父容器
         * @param {Element} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {Element} 返回被添加的显示对象
         * @memberof Bridge
         */
        addChildAt(parent: Element, target: Element, index: number): Element;
        /**
         * 移除显示对象
         *
         * @param {Element} parent 父容器
         * @param {Element} target 被移除的显示对象
         * @return {Element} 返回被移除的显示对象
         * @memberof Bridge
         */
        removeChild(parent: Element, target: Element): Element;
        /**
         * 按索引移除显示
         *
         * @param {Element} parent 父容器
         * @param {number} index 索引
         * @return {Element} 返回被移除的显示对象
         * @memberof Bridge
         */
        removeChildAt(parent: Element, index: number): Element;
        /**
         * 移除所有显示对象
         *
         * @param {Element} parent 父容器
         * @memberof Bridge
         */
        removeChildren(parent: Element): void;
        /**
         * 获取父容器
         *
         * @param {Element} target 目标对象
         * @returns {Element} 父容器
         * @memberof Bridge
         */
        getParent(target: Element): Element;
        /**
         * 获取指定索引处的显示对象
         *
         * @param {Element} parent 父容器
         * @param {number} index 指定父级索引
         * @return {Element} 索引处的显示对象
         * @memberof Bridge
         */
        getChildAt(parent: Element, index: number): Element;
        /**
         * 获取显示索引
         *
         * @param {Element} parent 父容器
         * @param {Element} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof Bridge
         */
        getChildIndex(parent: Element, target: Element): number;
        /**
         * 通过名称获取显示对象
         *
         * @param {Element} parent 父容器
         * @param {string} name 对象名称
         * @return {Element} 显示对象
         * @memberof Bridge
         */
        getChildByName(parent: Element, name: string): Element;
        /**
         * 获取子显示对象数量
         *
         * @param {Element} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof Bridge
         */
        getChildCount(parent: Element): number;
        private _listenerDict;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        mapListener(target: EventTarget, type: string, handler: (evt: Event) => void, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {EventTarget} target 事件目标对象
         * @param {string} type 事件类型
         * @param {(evt:Event)=>void} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        unmapListener(target: EventTarget, type: string, handler: (evt: Event) => void, thisArg?: any): void;
    }
}
