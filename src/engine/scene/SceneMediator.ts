import Mediator from "../component/Mediator"
import IBridge from "../../view/bridge/IBridge"
import IScene from "./IScene"
import IScenePolicy from "./IScenePolicy"
import {sceneManager} from "./SceneManager"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 实现了IScene接口的场景中介者基类
*/
export default abstract class SceneMediator extends Mediator implements IScene
{
    public constructor(bridge:IBridge, skin?:any, policy?:IScenePolicy)
    {
        super(bridge, skin);
        this.setPolicy(policy);
    }
    
    private _policy:IScenePolicy;
    /**
     * 获取弹出策略
     * 
     * @returns {IScenePolicy} 弹出策略
     * @memberof SceneMediator
     */
    public getPolicy():IScenePolicy
    {
        return this._policy;
    }
    /**
     * 设置弹出策略
     * 
     * @param {IScenePolicy} policy 弹出策略
     * @memberof SceneMediator
     */
    public setPolicy(policy:IScenePolicy):void
    {
        this._policy = policy;
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
        return sceneManager.switch(this, data);
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
        return sceneManager.push(this, data);
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
        return sceneManager.pop(this, data);
    }
}