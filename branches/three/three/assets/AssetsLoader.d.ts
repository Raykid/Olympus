import { Camera, Scene } from "three";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-13
 * @modify date 2018-02-13
 *
 * 资源加载器
*/
export interface IResource {
    scene: Scene;
    configText: string;
    camera?: Camera;
}
export interface IResourceDict {
    [url: string]: IResource;
}
export interface ILoaderHandler {
    /** 加载开始时调度 */
    start?: () => void;
    /** 加载进行时调度，加载完毕前会频繁调度 */
    progress?: (url: string, totalProgress: number) => void;
    /** 加载中某个url加载完毕时调度 */
    oneComplete?: (url: string) => void;
    /** 加载中某个url加载失败时调度 */
    oneError?: (err: Error) => void;
    /** 加载完毕时调度 */
    complete?: (dict: IResourceDict) => void;
}
/**
 * 获取缓存资源
 *
 * @export
 * @param {string} url 缓存url
 * @returns {IResource}
 */
export declare function getCache(url: string): IResource;
export default class AssetsLoader {
    private _handler;
    constructor(handler: ILoaderHandler);
    load(urls: string[]): void;
}
