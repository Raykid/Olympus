import IBridgeExt from "olympus-r/project/bridge/IBridgeExt";
import { IMaskEntity } from 'olympus-r/project/mask/MaskManager';
import IMediator from 'olympus-r/project/mediator/IMediator';
import IPanelPolicy from 'olympus-r/project/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/project/panel/IPromptPanel';
import IScenePolicy from 'olympus-r/project/scene/IScenePolicy';
import { MaskData } from "./dom/mask/MaskEntity";
import DOMBridge, { IInitParams } from './DOMBridge';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 基于DOM的表现层桥实现
*/
export default class DOMBridgeExt extends DOMBridge implements IBridgeExt {
    /** 提供静态类型常量 */
    static TYPE: string;
    protected _initParams: IInitParamsExt;
    /**
     * 获取舞台引用，DOM的舞台指向根节点
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly stage: HTMLElement;
    private _bgLayer;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly bgLayer: HTMLElement;
    private _sceneLayer;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly sceneLayer: HTMLElement;
    private _frameLayer;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly frameLayer: HTMLElement;
    private _panelLayer;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly panelLayer: HTMLElement;
    private _maskLayer;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly maskLayer: HTMLElement;
    private _topLayer;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {HTMLElement}
     * @memberof DOMBridge
     */
    readonly topLayer: HTMLElement;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof DOMBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof DOMBridge
     */
    readonly maskEntity: IMaskEntity;
    /**
     * 获取默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof DOMBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 获取默认场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof DOMBridge
     */
    defaultScenePolicy: IScenePolicy;
    constructor(params: IInitParamsExt);
    private createLayer();
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof DOMBridge
     */
    init(complete: (bridge: IBridgeExt) => void): void;
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {HTMLElement|string|string[]} skin 原始HTMLElement节点
     * @returns {HTMLElement} 包装后的HTMLElement节点
     * @memberof DOMBridge
     */
    wrapSkin(mediator: IMediator, skin: HTMLElement | string | string[]): HTMLElement;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof DOMBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
}
export interface IInitParamsExt extends IInitParams {
    /** 通用提示框类型 */
    promptClass?: IPromptPanelConstructor;
    /** 遮罩皮肤 */
    maskData?: MaskData;
}
