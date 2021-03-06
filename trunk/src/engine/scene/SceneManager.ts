import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { notify, wait } from "../../utils/SyncUtil";
import { maskManager } from '../mask/MaskManager';
import IScene from "./IScene";
import IScenePolicy from "./IScenePolicy";
import none from "./NoneScenePolicy";
import SceneMessage from "./SceneMessage";

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
     * @readonly
     * @type {IScene}
     * @memberof SceneManager
     */
    public get currentScene():IScene
    {
        return this._sceneStack[0];
    }

    /**
     * 获取活动场景个数
     * 
     * @readonly
     * @type {number}
     * @memberof SceneManager
     */
    public get activeCount():number
    {
        return this._sceneStack.length;
    }

    /**
     * 获取场景是否已经开启
     * 
     * @param {IScene} scene 场景对象
     * @returns {boolean} 是否已经开启
     * @memberof SceneManager
     */
    public isOpened(scene:IScene):boolean
    {
        return (this._sceneStack.indexOf(scene) >= 0);
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
        // 如果切入的是第一个场景，则改用push操作
        if(this.activeCount == 0)
            return this.push(scene, data);
        // 同步执行
        wait(
            SYNC_NAME,
            this.doChange,
            this,
            this.currentScene,
            scene,
            data,
            this.getScenePolicy(scene),
            ChangeType.Switch,
            ()=>{
                // 数据先行
                this._sceneStack[0] = scene;
                // 派发消息
                core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
            }
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
            this.currentScene,
            scene,
            data,
            this.getScenePolicy(scene),
            ChangeType.Push,
            ()=>{
                // 数据先行
                this._sceneStack.unshift(scene);
                // 派发消息
                core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
            }
        );
        return scene;
    }

    /**
     * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
     * 
     * @param {IScene} scene 要切换出的场景，如果传入的场景不是当前场景则仅移除指定场景，不会进行切换操作
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
        // 如果没有足够的场景储备则什么都不做
        if(this.activeCount <= 1)
        {
            console.log("场景栈中的场景数量不足，无法执行pop操作");
            // 完成步骤
            notify(SYNC_NAME);
            return;
        }
        // 验证是否是当前场景，不是则直接移除，不使用Policy
        var to:IScene = this._sceneStack[1];
        var policy:IScenePolicy = this.getScenePolicy(scene);
        if(this._sceneStack.indexOf(scene) != 0)
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
            ()=>{
                // 数据先行
                this._sceneStack.splice(this._sceneStack.indexOf(scene), 1);
                // 派发消息
                core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
            }
        );
    }

    private getScenePolicy(scene:IScene):IScenePolicy
    {
        return scene.policy || scene.bridge.defaultScenePolicy || none;
    }

    private getPolicyFuncs(policy:IScenePolicy, type:ChangeType):[(from?:IScene, to?:IScene)=>void, (from?:IScene, to?:IScene)=>Promise<void>]
    {
        var prepareFunc:(from?:IScene, to?:IScene)=>void;
        var doFunc:(from?:IScene, to?:IScene)=>Promise<void>;
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
        return [prepareFunc, doFunc];
    }
    
    private doChange(from:IScene, to:IScene, data:any, policy:IScenePolicy, type:ChangeType, begin?:()=>void, complete?:()=>void):void
    {
        // 添加遮罩
        maskManager.showMask(0);
        // 调用回调
        begin && begin();
        // 前置处理
        if(to)
        {
            to.bridge.htmlWrapper.style.display = "";
            from && from.onBeforeOut(to, data);
            to.onBeforeIn(from, data);
            // 派发事件
            core.dispatch(SceneMessage.SCENE_BEFORE_CHANGE, to, from);
        }
        // 判断是否是两个不同类型场景切换
        const changePromises:Promise<void>[] = [];
        if(from && to && to.bridge.type != from.bridge.type)
        {
            // 是两个不同类型的场景切换，则应各个场景执行各个policy操作
            if(from)
            {
                // from处理，不传递to
                const fromPolicy:IScenePolicy = this.getScenePolicy(from);
                const [fromPrepareFunc, fromDoFunc] = this.getPolicyFuncs(fromPolicy, type);
                // 调用准备接口
                fromPrepareFunc && fromPrepareFunc.call(fromPolicy, from, null);
                // 调用切换接口
                fromDoFunc && changePromises.push(fromDoFunc.call(fromPolicy, from, null).then(()=>{
                    from.bridge.htmlWrapper.style.display = "none";
                }));
            }
            if(to)
            {
                // to处理，不传递from
                const toPolicy:IScenePolicy = this.getScenePolicy(to);
                const [toPrepareFunc, toDoFunc] = this.getPolicyFuncs(toPolicy, type);
                // 调用准备接口
                toPrepareFunc && toPrepareFunc.call(toPolicy, null, to);
                // 添加显示
                to.bridge.addChild(to.bridge.sceneLayer, to.skin);
                // 调用切换接口
                toDoFunc && changePromises.push(toDoFunc.call(toPolicy, null, to));
            }
        }
        else
        {
            // 场景类型相同，常规处理
            const [prepareFunc, doFunc] = this.getPolicyFuncs(policy, type);
            // 调用准备接口
            prepareFunc && prepareFunc.call(policy, from, to);
            // 添加显示
            to && to.bridge.addChild(to.bridge.sceneLayer, to.skin);
            // 调用切换接口
            doFunc && changePromises.push(doFunc.call(policy, from, to));
        }
        // 等待所有切换动画结束后执行后续步骤
        Promise.all(changePromises).then(()=>{
            // 完成步骤
            notify(SYNC_NAME);
            // 移除显示
            to && from && from.bridge.removeChild(from.bridge.sceneLayer, from.skin);
            // 后置处理
            to && from && from.onAfterOut(to, data);
            to && to.onAfterIn(from, data);
            // 派发事件
            to && core.dispatch(SceneMessage.SCENE_AFTER_CHANGE, to, from);
            // 调用回调
            complete && complete();
            // 移除遮罩
            maskManager.hideMask();
        });
    }
}
/** 再额外导出一个单例 */
export const sceneManager:SceneManager = core.getInject(SceneManager)