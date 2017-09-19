import RenderMode from "./RenderMode";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-19
 * @modify date 2017-09-19
 * 
 * Egret初始化参数接口
*/
export default interface IInitParams
{
    /** 舞台宽度 */
    width:number;
    /** 舞台高度 */
    height:number;
    /** Egret工程根目录的相对路径前缀，例如："egret/" */
    pathPrefix:string;
    /** DOM容器名称或引用，不传递则自动生成一个 */
    container?:string|HTMLElement;
    /** 屏幕拉伸模式，使用egret.StageScaleMode中的常量值，默认为egret.StageScaleMode.SHOW_ALL */
    scaleMode?:string;
    /** 屏幕渲染帧频，默认为60 */
    frameRate?:number;
    /** 是否显示重绘矩形，默认为false */
    showPaintRect?:boolean;
    /** 多点触摸的最多点数，默认为2 */
    multiFingered?:number;
    /** 是否显示帧频信息，默认为false */
    showFPS?:boolean;
    /** 帧频样式，默认为："x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"*/
    showFPSStyle?:string;
    /** 是否显示日志信息，默认为false */
    showLog?:boolean;
    /** 背景颜色，默认黑色 */
    backgroundColor?:number;
    /** 渲染模式，在harpy.RenderMode中查找枚举值，默认为AUTO **/
    renderMode?:RenderMode;
}