import {core} from "../../core/Core"
import IConstructor from "../../core/interfaces/IConstructor"
import IScene from "./IScene"
import IScenePolicy from "./IScenePolicy"
import none from "./NoneScenePolicy"
import SceneMessage from "./SceneMessage"
import {wait, notify} from "../../utils/SyncUtil"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 弹窗管理器，包含切换场景、push场景、pop场景功能
*/

const SYNC_NAME:string = "SceneManager_sync";

enum ChangeType
{
    Switch,
    Push,
    Pop
}

@Injectable
export default class SceneManager
{
    private _sceneStack:IScene[] = [];

    /**
     * 获取当前场景
     * 
     * @returns {IScene} 当前场景
     * @memberof SceneManager
     */
    public getCurScene():IScene
    {
        return this._sceneStack[this._sceneStack.length - 1];
    }

    /**
     * 获取活动场景个数
     * 
     * @returns {number} 活动场景个数
     * @memberof SceneManager
     */
    public getActiveCount():number
    {
        return this._sceneStack.length;
    }

    /**
     * 切换场景，替换当前场景，当前场景会被销毁
     * 
     * @param {IScene} scene 要切换到的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    public switch(scene:IScene, data?:any):IScene
    {
        // 非空判断
        if(scene == null) return;
        // 如果切入的是第一个场景，则改用pushScene操作
        if(this.getActiveCount() == 0)
            return this.push(scene, data);
        // 同步执行
        wait(
            SYNC_NAME,
            this.doChange,
            this,
            this.getCurScene(),
            scene,
            data,
            scene.getPolicy(),
            ChangeType.Switch,
            ()=>this._sceneStack[length - 1] = scene
        );
        return scene;
    }

    /**
     * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
     * 
     * @param {IScene} scene 要推入的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    public push(scene:IScene, data?:any):IScene
    {
        // 非空判断
        if(scene == null) return scene;
        // 同步执行
        wait(
            SYNC_NAME,
            this.doChange,
            this,
            this.getCurScene(),
            scene,
            data,
            scene.getPolicy(),
            ChangeType.Push,
            ()=>this._sceneStack.push(scene)
        );
        return scene;
    }

    /**
     * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
     * 
     * @param {IScene} scene 要切换出的场景，仅做验证用，如果当前场景不是传入的场景则不会进行切换弹出操作
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    public pop(scene:IScene, data?:any):IScene
    {
        // 非空判断
        if(scene == null) return scene;
        // 同步执行
        wait(
            SYNC_NAME,
            this.doPop,
            this,
            scene,
            data
        );
        return scene;
    }

    private doPop(scene:IScene, data:any):void
    {
        // 如果是最后一个场景则什么都不做
        var length:number = this.getActiveCount();
        if(length <= 1)
        {
            console.log("已经是最后一个场景，无法执行popScene操作");
            // 完成步骤
            notify(SYNC_NAME);
            return;
        }
        // 验证是否是当前场景，不是则直接移除，不使用Policy
        var to:IScene = this._sceneStack[this._sceneStack.length - 2];
        var policy:IScenePolicy = scene.getPolicy();
        var index:number = this._sceneStack.indexOf(scene);
        if(index != length - 1)
        {
            to = null;
            policy = none;
        }
        // 执行切换
        this.doChange(
            scene,
            to,
            data,
            policy,
            ChangeType.Pop,
            ()=>this._sceneStack.splice(index, 1)
        );
    }
    
    private doChange(from:IScene, to:IScene, data:any, policy:IScenePolicy, type:ChangeType, complete:()=>void):void
    {
        if(policy == null) policy = none;
        // 如果要交替的两个场景不是同一个类型的场景，则暂不提供切换策略的支持，直接套用NoneScenePolicy
        if(from == null || to.getBridge().getType() != from.getBridge().getType())
            policy = none;
        // 派发事件
        core.dispatch(SceneMessage.SCENE_BEFORE_CHANGE, from, to);
        // 获取接口引用
        var prepareFunc:(from:IScene, to:IScene)=>void;
        var doFunc:(from:IScene, to:IScene, callback:()=>void)=>void;
        switch(type)
        {
            case ChangeType.Switch:
                prepareFunc = policy.prepareSwitch;
                doFunc = policy.switch;
                break;
            case ChangeType.Push:
                prepareFunc = policy.preparePush || policy.prepareSwitch;
                doFunc = policy.push || policy.switch;
                break;
            case ChangeType.Pop:
                prepareFunc = policy.preparePop || policy.prepareSwitch;
                doFunc = policy.pop || policy.switch;
                break;
        }
        // 调用准备接口
        prepareFunc.call(policy, from, to);
        // 前置处理
        from && from.onBeforeOut && from.onBeforeOut(to, data);
        to && to.onBeforeIn && to.onBeforeIn(from, data);
        // 调用切换接口
        doFunc.call(policy, from, to, ()=>{
            complete();
            // 后置处理
            from && from.onAfterOut && from.onAfterOut(to, data);
            to && to.onAfterIn && to.onAfterIn(from, data);
            // 派发事件
            core.dispatch(SceneMessage.SCENE_AFTER_CHANGE, from, to);
            // 完成步骤
            notify(SYNC_NAME);
        });
    }
}
/** 再额外导出一个单例 */
export const sceneManager:SceneManager = core.getInject(SceneManager)