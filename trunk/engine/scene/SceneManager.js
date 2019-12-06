import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import { notify, wait } from "../../utils/SyncUtil";
import { maskManager } from '../mask/MaskManager';
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
var SYNC_NAME = "SceneManager_sync";
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["Switch"] = 0] = "Switch";
    ChangeType[ChangeType["Push"] = 1] = "Push";
    ChangeType[ChangeType["Pop"] = 2] = "Pop";
})(ChangeType || (ChangeType = {}));
var SceneManager = /** @class */ (function () {
    function SceneManager() {
        this._sceneStack = [];
    }
    Object.defineProperty(SceneManager.prototype, "currentScene", {
        /**
         * 获取当前场景
         *
         * @readonly
         * @type {IScene}
         * @memberof SceneManager
         */
        get: function () {
            return this._sceneStack[0];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SceneManager.prototype, "activeCount", {
        /**
         * 获取活动场景个数
         *
         * @readonly
         * @type {number}
         * @memberof SceneManager
         */
        get: function () {
            return this._sceneStack.length;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 获取场景是否已经开启
     *
     * @param {IScene} scene 场景对象
     * @returns {boolean} 是否已经开启
     * @memberof SceneManager
     */
    SceneManager.prototype.isOpened = function (scene) {
        return (this._sceneStack.indexOf(scene) >= 0);
    };
    /**
     * 切换场景，替换当前场景，当前场景会被销毁
     *
     * @param {IScene} scene 要切换到的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    SceneManager.prototype.switch = function (scene, data) {
        var _this = this;
        // 非空判断
        if (scene == null)
            return;
        // 如果切入的是第一个场景，则改用push操作
        if (this.activeCount == 0)
            return this.push(scene, data);
        // 同步执行
        wait(SYNC_NAME, this.doChange, this, this.currentScene, scene, data, this.getScenePolicy(scene), ChangeType.Switch, function () {
            // 数据先行
            _this._sceneStack[0] = scene;
            // 派发消息
            core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
        });
        return scene;
    };
    /**
     * 推入场景，当前场景不会销毁，而是进入场景栈保存，以后可以通过popScene重新展现
     *
     * @param {IScene} scene 要推入的场景
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    SceneManager.prototype.push = function (scene, data) {
        var _this = this;
        // 非空判断
        if (scene == null)
            return scene;
        // 同步执行
        wait(SYNC_NAME, this.doChange, this, this.currentScene, scene, data, this.getScenePolicy(scene), ChangeType.Push, function () {
            // 数据先行
            _this._sceneStack.unshift(scene);
            // 派发消息
            core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
        });
        return scene;
    };
    /**
     * 弹出场景，当前场景会被销毁，当前位于栈顶的场景会重新显示
     *
     * @param {IScene} scene 要切换出的场景，如果传入的场景不是当前场景则仅移除指定场景，不会进行切换操作
     * @param {*} [data] 要携带给下一个场景的数据
     * @returns {IScene} 场景本体
     * @memberof SceneManager
     */
    SceneManager.prototype.pop = function (scene, data) {
        // 非空判断
        if (scene == null)
            return scene;
        // 同步执行
        wait(SYNC_NAME, this.doPop, this, scene, data);
        return scene;
    };
    SceneManager.prototype.doPop = function (scene, data) {
        var _this = this;
        // 如果没有足够的场景储备则什么都不做
        if (this.activeCount <= 1) {
            console.log("场景栈中的场景数量不足，无法执行pop操作");
            // 完成步骤
            notify(SYNC_NAME);
            return;
        }
        // 验证是否是当前场景，不是则直接移除，不使用Policy
        var to = this._sceneStack[1];
        var policy = this.getScenePolicy(scene);
        if (this._sceneStack.indexOf(scene) != 0) {
            to = null;
            policy = none;
        }
        // 执行切换
        this.doChange(scene, to, data, policy, ChangeType.Pop, function () {
            // 数据先行
            _this._sceneStack.splice(_this._sceneStack.indexOf(scene), 1);
            // 派发消息
            core.dispatch(SceneMessage.SCENE_STACK_CHANGE);
        });
    };
    SceneManager.prototype.getScenePolicy = function (scene) {
        return scene.policy || scene.bridge.defaultScenePolicy || none;
    };
    SceneManager.prototype.getPolicyFuncs = function (policy, type) {
        var prepareFunc;
        var doFunc;
        switch (type) {
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
    };
    SceneManager.prototype.doChange = function (from, to, data, policy, type, begin, complete) {
        // 添加遮罩
        maskManager.showMask(0);
        // 调用回调
        begin && begin();
        // 前置处理
        if (to) {
            to.bridge.htmlWrapper.style.display = "";
            from && from.onBeforeOut(to, data);
            to.onBeforeIn(from, data);
            // 派发事件
            core.dispatch(SceneMessage.SCENE_BEFORE_CHANGE, to, from);
        }
        // 判断是否是两个不同类型场景切换
        var changePromises = [];
        if (from && to && to.bridge.type != from.bridge.type) {
            // 是两个不同类型的场景切换，则应各个场景执行各个policy操作
            if (from) {
                // from处理，不传递to
                var fromPolicy = this.getScenePolicy(from);
                var _a = this.getPolicyFuncs(fromPolicy, type), fromPrepareFunc = _a[0], fromDoFunc = _a[1];
                // 调用准备接口
                fromPrepareFunc && fromPrepareFunc.call(fromPolicy, from, null);
                // 调用切换接口
                fromDoFunc && changePromises.push(fromDoFunc.call(fromPolicy, from, null).then(function () {
                    from.bridge.htmlWrapper.style.display = "none";
                }));
            }
            if (to) {
                // to处理，不传递from
                var toPolicy = this.getScenePolicy(to);
                var _b = this.getPolicyFuncs(toPolicy, type), toPrepareFunc = _b[0], toDoFunc = _b[1];
                // 调用准备接口
                toPrepareFunc && toPrepareFunc.call(toPolicy, null, to);
                // 添加显示
                to.bridge.addChild(to.bridge.sceneLayer, to.skin);
                // 调用切换接口
                toDoFunc && changePromises.push(toDoFunc.call(toPolicy, null, to));
            }
        }
        else {
            // 场景类型相同，常规处理
            var _c = this.getPolicyFuncs(policy, type), prepareFunc = _c[0], doFunc = _c[1];
            // 调用准备接口
            prepareFunc && prepareFunc.call(policy, from, to);
            // 添加显示
            to && to.bridge.addChild(to.bridge.sceneLayer, to.skin);
            // 调用切换接口
            doFunc && changePromises.push(doFunc.call(policy, from, to));
        }
        // 等待所有切换动画结束后执行后续步骤
        Promise.all(changePromises).then(function () {
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
    };
    SceneManager = tslib_1.__decorate([
        Injectable
    ], SceneManager);
    return SceneManager;
}());
export default SceneManager;
/** 再额外导出一个单例 */
export var sceneManager = core.getInject(SceneManager);
