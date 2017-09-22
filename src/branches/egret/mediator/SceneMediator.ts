import IScene from "engine/scene/IScene";
import MediatorProxy from "engine/scene/SceneMediator";
import IScenePolicy from "engine/scene/IScenePolicy";
import Mediator from "./Mediator";
import { bridgeManager } from "engine/bridge/BridgeManager";
import { sceneManager } from "engine/scene/SceneManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * Egret的场景中介者
*/
export default class SceneMediator extends Mediator implements IScene
{
    /**
     * 切换策略
     * 
     * @type {IScenePolicy}
     * @memberof SceneMediator
     */
    public policy:IScenePolicy;
    
    public constructor(skin?:any, policy?:IScenePolicy)
    {
        super(skin);
        MediatorProxy.call(this, this, policy);
    }

    /**
     * 打开当前场景（相当于调用SceneManager.push方法）
     * 
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    public open(data?:any):IScene
    {
        return MediatorProxy.prototype.open.call(this, data);
    }

    /**
     * 关闭当前场景（相当于调用SceneManager.pop方法）
     * 
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    public close(data?:any):IScene
    {
        return MediatorProxy.prototype.close.call(this, data);
    }

    /**
     * 切入场景开始前调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    public onBeforeIn(fromScene:IScene, data?:any):void
    {
        MediatorProxy.prototype.onBeforeIn.call(this, fromScene, data);
    }

    /**
     * 切入场景开始后调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    public onAfterIn(fromScene:IScene, data?:any):void
    {
        MediatorProxy.prototype.onAfterIn.call(this, fromScene, data);
    }

    /**
     * 切出场景开始前调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    public onBeforeOut(toScene:IScene, data?:any):void
    {
        MediatorProxy.prototype.onBeforeOut.call(this, toScene, data);
    }
    /**
     * 切出场景开始后调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    public onAfterOut(toScene:IScene, data?:any):void
    {
        MediatorProxy.prototype.onAfterOut.call(this, toScene, data);
    }
}