import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import IPlatform from "./IPlatform";
import WebPlatform from "./WebPlatform";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 * 
 * 平台接口管理器，通过桥接模式统一不同平台的不同接口，从而实现对框架其他模块透明化
*/
@Injectable
export default class PlatformManager implements IPlatform
{
    /**
     * 平台接口实现对象，默认是普通网页平台，也可以根据需要定制
     * 
     * @type {IPlatform}
     * @memberof PlatformManager
     */
    public platform:IPlatform = new WebPlatform();

    /**
     * 刷新当前页面
     * 
     * @memberof PlatformManager
     */
    public reload():void
    {
        this.platform.reload();
    }
}
/** 再额外导出一个单例 */
export const platformManager:PlatformManager = core.getInject(PlatformManager);