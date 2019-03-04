import IDisposable from "../../core/interfaces/IDisposable";
import IHasBridge from "../bridge/IHasBridge";
import IScenePolicy from "./IScenePolicy";
import IOpenClose from "../../core/interfaces/IOpenClose";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 *
 * 场景接口
*/
export default interface IScene<S = any, OD = any, CD = any> extends IHasBridge, IOpenClose, IDisposable {
    /** 显示对象 */
    skin: S;
    /** 切换策略 */
    policy: IScenePolicy<S>;
    /** 打开当前场景（相当于调用SceneManager.push方法） */
    open(data?: OD): IScene<S, OD, CD>;
    /** 关闭当前场景（相当于调用SceneManager.pop方法） */
    close(data?: CD): IScene<S, OD, CD>;
    /**
     * 切入场景开始前调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    onBeforeIn(fromScene: IScene<S, OD, CD>, data?: OD): void;
    /**
     * 切入场景开始后调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    onAfterIn(fromScene: IScene<S, OD, CD>, data?: OD): void;
    /**
     * 切出场景开始前调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    onBeforeOut(toScene: IScene<S, OD, CD>, data?: CD): void;
    /**
     * 切出场景开始后调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    onAfterOut(toScene: IScene<S, OD, CD>, data?: CD): void;
}
