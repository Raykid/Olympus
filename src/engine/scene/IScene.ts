import IHasBridge from "../../view/bridge/IHasBridge"
import IScenePolicy from "./IScenePolicy"

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-08
 * @modify date 2017-09-08
 * 
 * 场景接口
*/
export default interface IScene extends IHasBridge
{
    /** 获取切换策略 */
    getPolicy():IScenePolicy;
    /** 设置切换策略 */
    setPolicy(policy:IScenePolicy):void;
    /**
     * 切入场景开始前调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    onBeforeIn?(fromScene:IScene, data?:any):void;
    /**
     * 切入场景开始后调用
     * @param fromScene 从哪个场景切入
     * @param data 切场景时可能的参数
     */
    onAfterIn?(fromScene:IScene, data?:any):void;
    /**
     * 切出场景开始前调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    onBeforeOut?(toScene:IScene, data?:any):void;
    /**
     * 切出场景开始后调用
     * @param toScene 要切入到哪个场景
     * @param data 切场景时可能的参数
     */
    onAfterOut?(toScene:IScene, data?:any):void;
}