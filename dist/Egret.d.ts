/// <reference path="../src/branches/egret/egret-core/build/egret/egret.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/eui/eui.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/res/res.d.ts" />
/// <reference path="../src/branches/egret/egret-core/build/tween/tween.d.ts" />
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
declare module "branches/egret/RenderMode" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * 渲染模式枚举
    */
    enum RenderMode {
        AUTO = 0,
        CANVAS = 1,
        WEBGL = 2,
    }
    export default RenderMode;
}
declare module "branches/egret/IInitParams" {
    import RenderMode from "branches/egret/RenderMode";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-19
     * @modify date 2017-09-19
     *
     * Egret初始化参数接口
    */
    export default interface IInitParams {
        /** 舞台宽度 */
        width: number;
        /** 舞台高度 */
        height: number;
        /** Egret工程根目录的相对路径前缀，例如："egret/" */
        pathPrefix: string;
        /** DOM容器名称或引用，不传递则自动生成一个 */
        container?: string | HTMLElement;
        /** 屏幕拉伸模式，使用egret.StageScaleMode中的常量值，默认为egret.StageScaleMode.SHOW_ALL */
        scaleMode?: string;
        /** 屏幕渲染帧频，默认为60 */
        frameRate?: number;
        /** 是否显示重绘矩形，默认为false */
        showPaintRect?: boolean;
        /** 多点触摸的最多点数，默认为2 */
        multiFingered?: number;
        /** 是否显示帧频信息，默认为false */
        showFPS?: boolean;
        /** 帧频样式，默认为："x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"*/
        showFPSStyle?: string;
        /** 是否显示日志信息，默认为false */
        showLog?: boolean;
        /** 背景颜色，默认黑色 */
        backgroundColor?: number;
        /** 渲染模式，在harpy.RenderMode中查找枚举值，默认为AUTO **/
        renderMode?: RenderMode;
    }
}
declare module "branches/egret/Bridge" {
    import IBridge from "trunk/view/bridge/IBridge";
    import IInitParams from "branches/egret/IInitParams";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-18
     * @modify date 2017-09-18
     *
     * Egret的表现层桥实现
    */
    export default class Bridge implements IBridge {
        private _initParams;
        /**
         * 获取表现层类型名称
         *
         * @readonly
         * @type {string}
         * @memberof Bridge
         */
        readonly type: string;
        /**
         * 获取表现层HTML包装器，可以对其样式进行自定义调整
         *
         * @readonly
         * @type {HTMLElement}
         * @memberof Bridge
         */
        readonly htmlWrapper: HTMLElement;
        private _root;
        /**
         * 获取根显示节点
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof Bridge
         */
        readonly root: egret.DisplayObjectContainer;
        private _bgLayer;
        /**
         * 获取背景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof Bridge
         */
        readonly bgLayer: egret.DisplayObjectContainer;
        private _sceneLayer;
        /**
         * 获取场景容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof Bridge
         */
        readonly sceneLayer: egret.DisplayObjectContainer;
        private _panelLayer;
        /**
         * 获取弹窗容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof Bridge
         */
        readonly panelLayer: egret.DisplayObjectContainer;
        private _topLayer;
        /**
         * 获取顶级容器
         *
         * @readonly
         * @type {egret.DisplayObjectContainer}
         * @memberof Bridge
         */
        readonly topLayer: egret.DisplayObjectContainer;
        constructor(params: IInitParams);
        /**
         * 初始化表现层桥
         * @param {()=>void} complete 初始化完毕后的回调
         * @memberof Bridge
         */
        init(complete: (bridge: IBridge) => void): void;
        /**
         * 判断皮肤是否是Egret显示对象
         *
         * @param {*} skin 皮肤对象
         * @returns {boolean} 是否是Egret显示对象
         * @memberof Bridge
         */
        isMySkin(skin: any): boolean;
        /**
         * 添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof Bridge
         */
        addChild(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): egret.DisplayObject;
        /**
         * 按索引添加显示
         *
         * @param {egret.DisplayObjectContainer} parent 要添加到的父容器
         * @param {egret.DisplayObject} target 被添加的显示对象
         * @param {number} index 要添加到的父级索引
         * @return {egret.DisplayObject} 返回被添加的显示对象
         * @memberof Bridge
         */
        addChildAt(parent: egret.DisplayObjectContainer, target: egret.DisplayObject, index: number): egret.DisplayObject;
        /**
         * 移除显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 被移除的显示对象
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof Bridge
         */
        removeChild(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): egret.DisplayObject;
        /**
         * 按索引移除显示
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 索引
         * @return {egret.DisplayObject} 返回被移除的显示对象
         * @memberof Bridge
         */
        removeChildAt(parent: egret.DisplayObjectContainer, index: number): egret.DisplayObject;
        /**
         * 移除所有显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @memberof Bridge
         */
        removeChildren(parent: egret.DisplayObjectContainer): void;
        /**
         * 获取父容器
         *
         * @param {egret.DisplayObject} target 目标对象
         * @returns {egret.DisplayObjectContainer} 父容器
         * @memberof Bridge
         */
        getParent(target: egret.DisplayObject): egret.DisplayObjectContainer;
        /**
         * 获取指定索引处的显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {number} index 指定父级索引
         * @return {egret.DisplayObject} 索引处的显示对象
         * @memberof Bridge
         */
        getChildAt(parent: egret.DisplayObjectContainer, index: number): egret.DisplayObject;
        /**
         * 获取显示索引
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {egret.DisplayObject} target 子显示对象
         * @return {number} target在parent中的索引
         * @memberof Bridge
         */
        getChildIndex(parent: egret.DisplayObjectContainer, target: egret.DisplayObject): number;
        /**
         * 通过名称获取显示对象
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @param {string} name 对象名称
         * @return {egret.DisplayObject} 显示对象
         * @memberof Bridge
         */
        getChildByName(parent: egret.DisplayObjectContainer, name: string): egret.DisplayObject;
        /**
         * 获取子显示对象数量
         *
         * @param {egret.DisplayObjectContainer} parent 父容器
         * @return {number} 子显示对象数量
         * @memberof Bridge
         */
        getChildCount(parent: egret.DisplayObjectContainer): number;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        mapListener(target: egret.EventDispatcher, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {egret.EventDispatcher} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Bridge
         */
        unmapListener(target: egret.EventDispatcher, type: string, handler: Function, thisArg?: any): void;
    }
}
