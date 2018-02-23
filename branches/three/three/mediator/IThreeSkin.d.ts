import { Scene, Camera, Renderer } from "three";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-23
 * @modify date 2018-02-23
 *
 * 该接口规定了Three.js表现层所需的皮肤格式
*/
export default interface IThreeSkin {
    /**
     * Three.js显示对象
     *
     * @type {Object3D}
     * @memberof IThreeSkin
     */
    scene: Scene;
    /**
     * 摄像机对象
     *
     * @type {Camera}
     * @memberof IThreeSkin
     */
    camera: Camera;
    /**
     * 渲染器对象
     *
     * @type {Renderer}
     * @memberof IThreeSkin
     */
    renderer: Renderer;
    /**
     * 页面尺寸变化时调用，给出当前页面尺寸
     *
     * @param {number} width 页面宽度
     * @param {number} height 页面高度
     * @memberof IThreeSkin
     */
    resize?(width: number, height: number): void;
}
