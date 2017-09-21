import IScene from "engine/scene/IScene";
import MediatorProxy from "engine/scene/SceneMediator";
import IScenePolicy from "engine/scene/IScenePolicy";
import Mediator from "./Mediator";
import { bridgeManager } from "engine/bridge/BridgeManager";

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
    protected _proxy:MediatorProxy;

    /**
     * 切换策略
     * 
     * @type {IScenePolicy}
     * @memberof SceneMediator
     */
    public get policy():IScenePolicy
    {
        return this._proxy.policy;
    }
    public set policy(value:IScenePolicy)
    {
        this._proxy.policy = value;
    }
    
    public constructor(skin?:any, policy?:IScenePolicy)
    {
        super(skin);
        this._proxy.dispose();
        this._proxy = new MediatorProxy(this, policy);
        this.skin = this;
    }
    
    /**
     * 切入当前场景（相当于调用SceneManager.switch方法）
     * 
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    public switch(data?:any):IScene
    {
        return this._proxy.switch.call(this, data);
    }

    /**
     * 推入当前场景（相当于调用SceneManager.push方法）
     * 
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    public push(data?:any):IScene
    {
        return this._proxy.push.call(this, data);
    }

    /**
     * 弹出当前场景（相当于调用SceneManager.pop方法）
     * 
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    public pop(data?:any):IScene
    {
        return this._proxy.pop.call(this, data);
    }

    /**
     * 切入场景开始前调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    public onBeforeIn(fromScene:IScene, data?:any):void
    {
        // 可重写
    }

    /**
     * 切入场景开始后调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    public onAfterIn(fromScene:IScene, data?:any):void
    {
        // 可重写
    }

    /**
     * 切出场景开始前调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    public onBeforeOut(toScene:IScene, data?:any):void
    {
        // 可重写
    }
    /**
     * 切出场景开始后调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    public onAfterOut(toScene:IScene, data?:any):void
    {
        // 可重写
    }
}