import { Camera } from "three";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 * 
 * Three.js场景可能需要的一些参数接口
*/
export default interface IThreeScene
{
    /**
     * 如果在场景中给出了摄像机对象，则会代替默认的摄像机进行渲染
     * 
     * @type {Camera}
     * @memberof IThreeScene
     */
    camera?:Camera;
}