var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Mediator from "../mediator/Mediator";
import { sceneManager } from "./SceneManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 实现了IScene接口的场景中介者基类
*/
var SceneMediator = /** @class */ (function (_super) {
    __extends(SceneMediator, _super);
    function SceneMediator(skin, policy) {
        var _this = _super.call(this, skin) || this;
        _this.policy = policy;
        return _this;
    }
    /**
     * 打开当前场景（相当于调用SceneManager.push方法）
     *
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    SceneMediator.prototype.open = function (data) {
        return sceneManager.push(this, data);
    };
    /**
     * 打开当前场景（只能由SceneManager调用）
     *
     * @param {*} [data] 数据
     * @memberof SceneMediator
     */
    SceneMediator.prototype.__open = function (data) {
        _super.prototype.open.call(this, data);
    };
    /**
     * 关闭当前场景（相当于调用SceneManager.pop方法）
     *
     * @param {*} [data] 数据
     * @returns {IScene} 场景本体
     * @memberof SceneMediator
     */
    SceneMediator.prototype.close = function (data) {
        return sceneManager.pop(this, data);
    };
    /**
     * 关闭当前场景（只能由SceneManager调用）
     *
     * @param {*} [data] 数据
     * @memberof SceneMediator
     */
    SceneMediator.prototype.__close = function (data) {
        _super.prototype.close.call(this, data);
    };
    /**
     * 切入场景开始前调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    SceneMediator.prototype.onBeforeIn = function (fromScene, data) {
        // 可重写
    };
    /**
     * 切入场景开始后调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    SceneMediator.prototype.onAfterIn = function (fromScene, data) {
        // 可重写
    };
    /**
     * 切出场景开始前调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    SceneMediator.prototype.onBeforeOut = function (toScene, data) {
        // 可重写
    };
    /**
     * 切出场景开始后调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    SceneMediator.prototype.onAfterOut = function (toScene, data) {
        // 可重写
    };
    return SceneMediator;
}(Mediator));
export default SceneMediator;
