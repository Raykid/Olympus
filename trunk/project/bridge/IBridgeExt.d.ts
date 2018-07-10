import IBridge from '../../kernel/interfaces/IBridge';
import { IMaskEntity } from "../mask/MaskManager";
import IMediator from "../mediator/IMediator";
import IPanelPolicy from "../panel/IPanelPolicy";
import { IPromptPanelConstructor } from "../panel/IPromptPanel";
import IScenePolicy from "../scene/IScenePolicy";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 *
 * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IBridgeExt extends IBridge {
    /**
     * 获取舞台引用
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly stage: any;
    /**
     * 获取背景容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly bgLayer: any;
    /**
     * 获取场景容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly sceneLayer: any;
    /**
     * 获取框架容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly frameLayer: any;
    /**
     * 获取弹窗容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly panelLayer: any;
    /**
     * 获取遮罩容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly maskLayer: any;
    /**
     * 获取顶级容器
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly topLayer: any;
    /**
     * 获取通用提示框
     *
     * @readonly
     * @type {IPromptPanelConstructor}
     * @memberof IBridge
     */
    readonly promptClass: IPromptPanelConstructor;
    /**
     * 获取遮罩实体
     *
     * @readonly
     * @type {IMaskEntity}
     * @memberof IBridge
     */
    readonly maskEntity: IMaskEntity;
    /**
     * 获取或设置默认弹窗策略
     *
     * @type {IPanelPolicy}
     * @memberof IBridge
     */
    defaultPanelPolicy: IPanelPolicy;
    /**
     * 获取或设置场景切换策略
     *
     * @type {IScenePolicy}
     * @memberof IBridge
     */
    defaultScenePolicy: IScenePolicy;
    /**
     * 加载资源
     *
     * @param {string[]} assets 资源数组
     * @param {IMediator} mediator 要加载资源的中介者
     * @param {(err?:Error)=>void} handler 回调函数
     * @memberof IBridge
     */
    loadAssets(assets: string[], mediator: IMediator, handler: (err?: Error) => void): void;
}
