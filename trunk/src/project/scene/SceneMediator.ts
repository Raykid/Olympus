import Mediator from "../mediator/Mediator";
import IScene from "./IScene";
import IScenePolicy from "./IScenePolicy";
import { sceneManager } from "./SceneManager";
import MediatorMessage from "../mediator/MediatorMessage";

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

    protected __afterOnOpen(data?:any):void
    {
        sceneManager.push(this, data);
    }

    protected __afterOnClose(data?:any):void
    {
        // 篡改onAfterOut，等待关闭动画结束后再执行
        var oriOnAfterOut:(toScene:IScene, data?:any)=>void = this.onAfterOut;
        this.onAfterOut = (toScene:IScene, data?:any)=>{
            oriOnAfterOut.call(this, toScene, data);
            // 派发关闭事件
            this.dispatch(MediatorMessage.MEDIATOR_CLOSED, this);
        };
        sceneManager.pop(this, data);
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