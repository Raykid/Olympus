/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-01
 * @modify date 2017-09-01
 *
 * 这个ts文件是为了让编译器认识装饰器注入功能而造的
*/
declare namespace global {
    interface IConstructor extends Function {
        new (...args: any[]): any;
    }
    interface IInjectableParams {
        type: IConstructor;
    }
    class Inject {
        private static _injectDict;
        /**
         * 获取注入字典
         *
         * @static
         * @returns {{[key:string]:any}}
         * @memberof Inject
         */
        static getInjectDict(): {
            [key: string]: any;
        };
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @static
         * @memberof Inject
         */
        static mapInject(target: IConstructor, type?: IConstructor): void;
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @static
         * @memberof Inject
         */
        static mapInjectValue(value: any, type?: IConstructor): void;
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @static
         * @memberof Inject
         */
        static unmapInject(target: IConstructor): void;
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @static
         * @memberof Inject
         */
        static getInject(type: IConstructor): any;
    }
}
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * 这个文件的存在是为了让装饰器功能可以正常使用，装饰器要求方法必须从window上可访问，因此不能定义在模块里
*/
declare function Inject(cls: global.IConstructor): PropertyDecorator;
declare function Injectable(cls: global.IConstructor): void;
declare function Injectable(cls: global.IInjectableParams): ClassDecorator;
declare module "core/interfaces/IConstructor" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 任意构造器接口
    */
    export default interface IConstructor extends Function {
        new (...args: any[]): any;
    }
}
declare module "core/message/IMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息接口
    */
    export default interface IMessage {
        /**
         * 获取消息类型
         *
         * @returns {string} 消息类型
         * @memberof IMessage
         */
        getType(): string;
    }
}
declare module "core/message/Message" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 框架内核消息基类
    */
    export default class Message implements IMessage {
        private _type;
        getType(): string;
        /**
         * 消息参数列表
         *
         * @type {any[]}
         * @memberof Message
         */
        params: any[];
        /**
         * Creates an instance of Message.
         * @param {string} type 消息类型
         * @param {...any[]} params 可能的消息参数列表
         * @memberof Message
         */
        constructor(type: string, ...params: any[]);
    }
}
declare module "core/command/Command" {
    import IMessage from "core/message/IMessage";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令类，内核命令在注册了消息后可以在消息派发时被执行
    */
    export default class Command {
        /**
         * 触发该Command运行的Message实例
         *
         * @type {IMessage}
         * @memberof Command
         */
        msg: IMessage;
        constructor(msg: IMessage);
        exec(): void;
    }
}
declare module "core/command/ICommandConstructor" {
    import IMessage from "core/message/IMessage";
    import Command from "core/command/Command";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 内核命令接口
    */
    export default interface ICommandConstructor {
        new (msg: IMessage): Command;
    }
}
declare module "core/interfaces/IDisposable" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-01
     * @modify date 2017-09-01
     *
     * 可回收接口
    */
    export default interface IDisposable {
        dispose(): void;
    }
}
declare module "core/mediator/IMediator" {
    import IDisposable from "core/interfaces/IDisposable";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 界面中介者接口
    */
    export default interface IMediator extends IDisposable {
        /**
         * 获取中介者是否已被销毁
         *
         * @returns {boolean} 是否已被销毁
         * @memberof IMediator
         */
        isDisposed(): boolean;
        /**
         * 获取皮肤
         *
         * @returns {*} 皮肤引用
         * @memberof IMediator
         */
        getSkin(): any;
        /**
         * 设置皮肤
         *
         * @param {*} value 皮肤引用
         * @memberof IMediator
         */
        setSkin(value: any): void;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof IMediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof IMediator
         */
        unmapAllListeners(): void;
    }
}
declare module "core/mediator/Mediator" {
    import IMediator from "core/mediator/IMediator";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-04
     * @modify date 2017-09-04
     *
     * 界面中介者基类，不能直接继承使用该基类，而需要继承不同表现层提供的中介者类
    */
    export default class Mediator implements IMediator {
        constructor(skin?: any);
        private _isDestroyed;
        /**
         * 获取中介者是否已被销毁
         *
         * @returns {boolean} 是否已被销毁
         * @memberof Mediator
         */
        isDisposed(): boolean;
        private _skin;
        /**
         * 获取皮肤
         *
         * @returns {*} 皮肤引用
         * @memberof Mediator
         */
        getSkin(): any;
        /**
         * 设置皮肤
         *
         * @param {*} value 皮肤引用
         * @memberof Mediator
         */
        setSkin(value: any): void;
        private _listeners;
        /**
         * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        protected doMalListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销监听事件
         *
         * @param {*} target 事件目标对象
         * @param {string} type 事件类型
         * @param {Function} handler 事件处理函数
         * @param {*} [thisArg] this指向对象
         * @memberof Mediator
         */
        unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
        protected doUnmalListener(target: any, type: string, handler: Function, thisArg?: any): void;
        /**
         * 注销所有注册在当前中介者上的事件监听
         *
         * @memberof Mediator
         */
        unmapAllListeners(): void;
        /**
         * 销毁中介者
         *
         * @memberof Mediator
         */
        dispose(): void;
    }
}
declare module "core/Core" {
    import IConstructor from "core/interfaces/IConstructor";
    import IMessage from "core/message/IMessage";
    import Message from "core/message/Message";
    import ICommandConstructor from "core/command/ICommandConstructor";
    import Command from "core/command/Command";
    import IMediator from "core/mediator/IMediator";
    import Mediator from "core/mediator/Mediator";
    /**
     * 核心上下文对象，负责内核消息消息转发、对象注入等核心功能的实现
     *
     * @export
     * @class Core
     */
    export class Core {
        private static _instance;
        constructor();
        /*********************** 内核消息语法糖处理逻辑 ***********************/
        private _messageHandlerDict;
        private handleMessageSugars(msg, target);
        /*********************** 下面是内核消息系统 ***********************/
        private _listenerDict;
        private handleMessages(msg);
        /**
         * 派发内核消息
         *
         * @param {IMessage} msg 内核消息实例
         * @memberof Core
         */
        dispatch(msg: IMessage): void;
        /**
         * 派发内核消息，消息会转变为Message类型对象
         *
         * @param {string} type 消息类型
         * @param {...any[]} params 消息参数列表
         * @memberof Core
         */
        dispatch(type: string, ...params: any[]): void;
        /**
         * 监听内核消息
         *
         * @param {string} type 消息类型
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        listen(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /**
         * 移除内核消息监听
         *
         * @param {string} type 消息类型
         * @param {(msg:IMessage)=>void} handler 消息处理函数
         * @param {*} [thisArg] 消息this指向
         * @memberof Core
         */
        unlisten(type: string, handler: (msg: IMessage) => void, thisArg?: any): void;
        /*********************** 下面是依赖注入系统 ***********************/
        private handleInjects(msg);
        /**
         * 添加一个类型注入，会立即生成一个实例并注入到框架内核中
         *
         * @param {IConstructor} target 要注入的类型（注意不是实例）
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入类型自身作为key
         * @memberof Core
         */
        mapInject(target: IConstructor, type?: IConstructor): void;
        /**
         * 注入一个对象实例
         *
         * @param {*} value 要注入的对象实例
         * @param {IConstructor} [type] 如果提供该参数，则使用该类型代替注入类型的key，否则使用注入实例的构造函数作为key
         * @memberof Core
         */
        mapInjectValue(value: any, type?: IConstructor): void;
        /**
         * 移除类型注入
         *
         * @param {IConstructor} target 要移除注入的类型
         * @memberof Core
         */
        unmapInject(target: IConstructor): void;
        /**
         * 获取注入的对象实例
         *
         * @param {(IConstructor)} type 注入对象的类型
         * @returns {*} 注入的对象实例
         * @memberof Core
         */
        getInject(type: IConstructor): any;
        /*********************** 下面是内核命令系统 ***********************/
        private _commandDict;
        private handleCommands(msg);
        /**
         * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
         *
         * @param {string} type 要注册的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
         * @memberof Core
         */
        mapCommand(type: string, cmd: ICommandConstructor): void;
        /**
         * 注销命令
         *
         * @param {string} type 要注销的消息类型
         * @param {(ICommandConstructor)} cmd 命令处理器
         * @returns {void}
         * @memberof Core
         */
        unmapCommand(type: string, cmd: ICommandConstructor): void;
        /*********************** 下面是界面中介者系统 ***********************/
        private _mediatorList;
        private handleMediators(msg);
        /**
         * 注册界面中介者
         *
         * @param {IMediator} mediator 要注册的界面中介者实例
         * @memberof Core
         */
        mapMediator(mediator: IMediator): void;
        /**
         * 注销界面中介者
         *
         * @param {IMediator} mediator 要注销的界面中介者实例
         * @memberof Core
         */
        unmapMediator(mediator: IMediator): void;
    }
    const _default: Core;
    export default _default;
    /** 导出Core模组常用模块 */
    export { IConstructor, IMessage, Message, ICommandConstructor, Command, IMediator, Mediator };
}
declare module "engine/popup/IPopupPolicy" {
    import IPopup from "engine/popup/IPopup";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗动画策略，负责将弹窗动画与弹窗实体解耦
    */
    export default interface IPopupPolicy {
        /**
         * 显示时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param from 动画起始点
         */
        open(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        /**
         * 关闭时调用
         * @param popup 弹出框对象
         * @param callback 完成回调，必须调用
         * @param to 动画完结点
         */
        close(popup: IPopup, callback: () => void, to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/popup/IPopup" {
    import IDisposable from "core/interfaces/IDisposable";
    import IPopupPolicy from "engine/popup/IPopupPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗中介者接口
    */
    export default interface IPopup extends IDisposable {
        /** 获取弹窗的实体显示对象 */
        getSkin(): any;
        /** 获取弹出策略 */
        getPolicy(): IPopupPolicy;
        /** 在弹出前调用的方法 */
        onBeforeOpen(isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在弹出后调用的方法 */
        onAfterOpen(isModel?: boolean, from?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭前调用的方法 */
        onBeforeClose(to?: {
            x: number;
            y: number;
        }): void;
        /** 在关闭后调用的方法 */
        onAfterClose(to?: {
            x: number;
            y: number;
        }): void;
    }
}
declare module "engine/popup/NonePopupPolicy" {
    import IPopup from "engine/popup/IPopup";
    import IPopupPolicy from "engine/popup/IPopupPolicy";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 无任何动画的弹出策略，可应用于任何显示层实现
    */
    export class NonePopupPolicy implements IPopupPolicy {
        open(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
        close(popup: IPopup, callback: () => void, from?: {
            x: number;
            y: number;
        }): void;
    }
    const _default: NonePopupPolicy;
    export default _default;
}
declare module "engine/popup/PopupMessage" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗相关的消息
    */
    export default class PopupMessage {
        /**
         * 打开弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_BEFORE_OPEN: string;
        /**
         * 打开弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_AFTER_OPEN: string;
        /**
         * 关闭弹窗前的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_BEFORE_CLOSE: string;
        /**
         * 关闭弹窗后的消息
         *
         * @static
         * @type {string}
         * @memberof PopupMessage
         */
        static POPUP_AFTER_CLOSE: string;
    }
}
declare module "engine/popup/PopupManager" {
    import { IConstructor } from "core/Core";
    import IPopup from "engine/popup/IPopup";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * 弹窗管理器，包含弹出弹窗、关闭弹窗、弹窗管理等功能
    */
    export default class PopupManager {
        private _popups;
        /**
         * 获取当前显示的弹窗数组（副本）
         *
         * @param {IConstructor} [cls] 弹窗类型，如果传递该参数则只返回该类型的已打开弹窗，否则将返回所有已打开的弹窗
         * @returns {IPopup[]} 已打开弹窗数组
         * @memberof PopupManager
         */
        getOpened(cls?: IConstructor): IPopup[];
        /**
         * 打开一个弹窗
         *
         * @param {IPopup} popup 要打开的弹窗
         * @param {boolean} [isModel=true] 是否模态弹出
         * @param {{x:number, y:number}} [from] 弹出起点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        open(popup: IPopup, isModel?: boolean, from?: {
            x: number;
            y: number;
        }): IPopup;
        /**
         * 关闭一个弹窗
         *
         * @param {IPopup} popup 要关闭的弹窗
         * @param {{x:number, y:number}} [to] 关闭终点位置
         * @returns {IPopup} 返回弹窗对象
         * @memberof PopupManager
         */
        close(popup: IPopup, to?: {
            x: number;
            y: number;
        }): IPopup;
    }
}
declare module "engine/Engine" {
    import PopupManager from "engine/popup/PopupManager";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
    */
    export { PopupManager };
}
declare module "env/explorer/ExplorerType" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * 浏览器类型枚举
    */
    enum ExplorerType {
        IE = 0,
        EDGE = 1,
        OPERA = 2,
        FIREFOX = 3,
        SAFARI = 4,
        CHROME = 5,
        OTHERS = 6,
    }
    export default ExplorerType;
}
declare module "env/explorer/Explorer" {
    import ExplorerType from "env/explorer/ExplorerType";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Explorer类记录浏览器相关数据
    */
    export default class Explorer {
        private _type;
        /**
         * 获取浏览器类型枚举值
         *
         * @returns {ExplorerType} 浏览器类型枚举值
         * @memberof Env
         */
        getType(): ExplorerType;
        private _typeStr;
        /**
         * 获取浏览器类型字符串
         *
         * @returns {string} 浏览器类型字符串
         * @memberof Env
         */
        getTypeStr(): string;
        private _version;
        /**
         * 获取浏览器版本
         *
         * @returns {string} 浏览器版本
         * @memberof Explorer
         */
        getVersion(): string;
        private _bigVersion;
        /**
         * 获取浏览器大版本
         *
         * @returns {string} 浏览器大版本
         * @memberof Explorer
         */
        getBigVersion(): string;
        constructor();
    }
}
declare module "env/external/External" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * External类为window.external参数字典包装类
    */
    export default class External {
        private _params;
        constructor();
        /**
         * 获取window.external中的参数
         *
         * @param {string} key 参数名
         * @returns {*} 参数值
         * @memberof External
         */
        getParam(key: string): any;
    }
}
declare module "env/query/Query" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Query类记录通过GET参数传递给框架的参数字典
    */
    export default class Query {
        private _params;
        constructor();
        /**
         * 获取GET参数
         *
         * @param {string} key 参数key
         * @returns {string} 参数值
         * @memberof Query
         */
        getParam(key: string): string;
    }
}
declare module "env/hash/Hash" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * Hash类是地址路由（网页哈希）管理器，规定哈希格式为：#[模块名]?[参数名]=[参数值]&[参数名]=[参数值]&...
    */
    export default class Hash {
        private _hash;
        /**
         * 获取原始的哈希字符串
         *
         * @returns {string}
         * @memberof Hash
         */
        getHash(): string;
        private _moduleName;
        /**
         * 获取模块名
         *
         * @returns {string} 模块名
         * @memberof Hash
         */
        getModuleName(): string;
        private _params;
        /**
         * 获取传递给模块的参数
         *
         * @returns {{[key:string]:string}} 模块参数
         * @memberof Hash
         */
        getParams(): {
            [key: string]: string;
        };
        private _direct;
        /**
         * 获取是否直接跳转模块
         *
         * @returns {boolean} 是否直接跳转模块
         * @memberof Hash
         */
        getDirect(): boolean;
        private _keepHash;
        /**
         * 获取是否保持哈希值
         *
         * @returns {boolean} 是否保持哈希值
         * @memberof Hash
         */
        getKeepHash(): boolean;
        constructor();
        /**
         * 获取指定哈希参数
         *
         * @param {string} key 参数名
         * @returns {string} 参数值
         * @memberof Hash
         */
        getParam(key: string): string;
    }
}
declare module "env/Env" {
    import Explorer from "env/explorer/Explorer";
    import External from "env/external/External";
    import Query from "env/query/Query";
    import Hash from "env/hash/Hash";
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-05
     * @modify date 2017-09-05
     *
     * Env模块是Olympus框架用来集成与运行时环境相关的部分，如浏览器环境、开发环境、运行时参数等
    */
    export { Explorer, Query, External, Hash };
}
declare module "view/IView" {
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
declare module "view/View" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-06
     * @modify date 2017-09-06
     *
     * View是表现层模组，用来管理所有表现层对象
    */
    export default class View {
    }
}
