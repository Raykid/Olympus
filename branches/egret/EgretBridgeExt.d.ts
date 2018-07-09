import IBridgeExt from 'olympus-r/project/bridge/IBridgeExt';
import { IMaskEntity } from 'olympus-r/project/mask/MaskManager';
import IMediator from 'olympus-r/project/mediator/IMediator';
import IPanelPolicy from 'olympus-r/project/panel/IPanelPolicy';
import { IPromptPanelConstructor } from 'olympus-r/project/panel/IPromptPanel';
import IScenePolicy from 'olympus-r/project/scene/IScenePolicy';
import { MaskData } from "./egret/mask/MaskEntity";
import EgretBridge, { IInitParams } from './EgretBridge';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * Egret的表现层桥实现，当前Egret版本：5.0.7
*/
export default class EgretBridgeExt extends EgretBridge implements IBridgeExt {
    /** 提供静态类型常量 */
    static TYPE: string;
    protected _initParams: IInitParamsExt;
    private _stage;
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {egret.Stage}
     * @memberof EgretBridge
     */
    readonly stage: egret.Stage;
    private _bgLayer;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly bgLayer: egret.DisplayObjectContainer;
    private _sceneLayer;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly sceneLayer: egret.DisplayObjectContainer;
    private _frameLayer;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly frameLayer: egret.DisplayObjectContainer;
    private _panelLayer;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly panelLayer: egret.DisplayObjectContainer;
    private _maskLayer;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly maskLayer: egret.DisplayObjectContainer;
    private _topLayer;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {egret.DisplayObjectContainer}
     * @memberof EgretBridge
     */
    readonly topLayer: egret.DisplayObjectContainer;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof EgretBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof EgretBridge
     */
    readonly maskEntity: IMaskEntity;
    /**
     * 默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof EgretBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 默认场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof EgretBridge
     */
    defaultScenePolicy: IScenePolicy;
    constructor(params: IInitParamsExt);
    protected onRootInitialized(root: eui.UILayer, complete: (bridge: IBridgeExt) => void): void;
    /**
     * 包装HTMLElement节点
     *
     * @param {IMediator} mediator 中介者
     * @param {*} skin 原始皮肤
     * @returns {egret.DisplayObject} 包装后的皮肤
     * @memberof EgretBridge
     */
    wrapSkin(mediator: IMediator, skin: any): egret.DisplayObject;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IMediator} mediator 中介者
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof EgretBridge
     */
    replaceSkin(mediator: IMediator, current: egret.DisplayObject, target: any): any;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 资源列表
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof EgretBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
}
export interface IInitParamsExt extends IInitParams {
    /** 通用提示框类型 */
    promptClass?: IPromptPanelConstructor;
    /** 遮罩数据 */
    maskData?: MaskData;
}
