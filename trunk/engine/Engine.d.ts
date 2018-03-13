import IBridge from "./bridge/IBridge";
import IPlugin from "./plugin/IPlugin";
import IMediatorConstructor from "./mediator/IMediatorConstructor";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 *
 * Engine模组是开发框架的引擎部分，包括业务模块系统、应用程序启动和初始化、弹窗和场景管理器等与项目开发相关的逻辑都在这个模组中
 * 这个模组的逻辑都高度集成在子模组中了，因此也只是收集相关子模组
*/
export default class Engine {
    private _initParams;
    private _loadElement;
    /**
     * 初始化Engine
     *
     * @param {IInitParams} params 初始化参数
     * @memberof Engine
     */
    initialize(params: IInitParams): void;
    /**
     * 添加错误监听函数
     *
     * @param {(evt?:ErrorEvent)=>void} handler 错误监听函数
     * @memberof Engine
     */
    listenError(handler: (evt?: ErrorEvent) => void): void;
    private onAllBridgesInit();
    private onPreloadOK();
    private onModuleChange(from);
}
/** 再额外导出一个单例 */
export declare const engine: Engine;
export declare enum InitStep {
    /** 框架已准备好初始化 */
    ReadyToInit = 0,
    /** 开始执行初始化 */
    StartInit = 1,
    /** 版本号系统初始化完毕 */
    VersionInited = 2,
    /** 表现层桥初始化完毕 */
    BridgesInited = 3,
    /** 预加载，可能会触发多次，每次传递两个参数：预加载文件名或路径、预加载文件内容 */
    Preload = 4,
    /** 开始打开首个模块 */
    OpenFirstModule = 5,
    /** 首个模块打开完毕，初始化流程完毕 */
    Inited = 6,
}
export interface IInitParams {
    /**
     * 表现层桥数组，所有可能用到的表现层桥都要在此实例化并传入
     *
     * @type {IBridge[]}
     * @memberof OlympusInitParams
     */
    bridges: IBridge[];
    /**
     * 首模块类型，框架初始化完毕后进入的模块
     *
     * @type {IMediatorConstructor}
     * @memberof OlympusInitParams
     */
    firstModule: IMediatorConstructor;
    /**
     * 会在首个模块被显示出来后从页面中移除
     *
     * @type {(Element|string)}
     * @memberof OlympusInitParams
     */
    loadElement?: Element | string;
    /**
     * 环境字符串，默认为"dev"
     *
     * @type {string}
     * @memberof IInitParams
     */
    env?: string;
    /**
     * 加载version.cfg文件的版本号，不传则使用随机时间戳作为版本号
     *
     * @type {string}
     * @memberof IInitParams
     */
    version?: string;
    /**
     * 消息域名字典数组，首个字典会被当做默认字典，没传递则会用当前域名代替
     *
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    hostsDict?: {
        [env: string]: string[];
    };
    /**
     * CDN域名列表，若没有提供则使用host代替
     *
     * @type {{[env:string]:string[]}}
     * @memberof IInitParams
     */
    cdnsDict?: {
        [env: string]: string[];
    };
    /**
     * 插件列表
     *
     * @type {IPlugin[]}
     * @memberof IInitParams
     */
    plugins?: IPlugin[];
    /**
     * 短名称路径字典，key是短名称，value是路径
     *
     * @type {{[key:string]:string}}
     * @memberof IInitParams
     */
    pathDict?: {
        [key: string]: string;
    };
    /**
     * 预加载数组或字典，如果是字典则key为短名称，value为资源路径
     * 会在表现层桥初始化完毕后、框架初始化完毕前加载，加载结果会保存在AssetsManager中
     *
     * @type {string[]}
     * @memberof IInitParams
     */
    preloads?: string[];
    /**
     * 初始化进度变化时调用，第一个参数为进度数值，范围是[0, 1]；第二个参数是所在步骤枚举值；第三个参数是步骤提供的参数列表
     *
     * @memberof IInitParams
     */
    onInitProgress?: (progress?: number, step?: InitStep, ...args: any[]) => void;
    /**
     * 框架初始化完毕时调用
     *
     * @type {()=>void}
     * @memberof IInitParams
     */
    onInited?: () => void;
    /**
     * 项目出现报错时调用，提供Error对象和ErrorEvent对象
     *
     * @memberof IInitParams
     */
    onError?: (evt?: ErrorEvent) => void;
}
