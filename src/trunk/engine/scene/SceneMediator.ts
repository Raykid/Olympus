import Mediator from "../mediator/Mediator";
import IScene from "./IScene";
import IScenePolicy from "./IScenePolicy";
import { sceneManager } from "./SceneManager";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 实现了IScene接口的场景中介者基类
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
        this.policy = policy;
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
        super.open(data);
        return sceneManager.push(this, data);
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
        this.onClose(data);
        return sceneManager.pop(this, data);
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