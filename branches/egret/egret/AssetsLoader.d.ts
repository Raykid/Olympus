/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 资源加载器
*/
export interface IGroupParams {
    name: string;
    priority?: number;
}
export interface IItemDict {
    [key: string]: RES.ResourceItem;
}
export interface IResourceDict {
    [groupName: string]: IItemDict;
}
export interface ILoaderHandler {
    /** 加载开始时调度 */
    start?: () => void;
    /** 加载进行时调度，加载完毕前会频繁调度 */
    progress?: (resource: RES.ResourceItem, totalProgress: number) => void;
    /** 加载中某个group加载完毕时调度 */
    oneComplete?: (dict: IItemDict) => void;
    /** 加载中某个group加载失败时调度 */
    oneError?: (evt: RES.ResourceEvent) => void;
    /** 加载完毕时调度 */
    complete?: (dict: IResourceDict) => void;
}
export declare class ResourceVersionController extends RES.VersionController {
    getVirtualUrl(url: string): string;
}
export default class AssetsLoader {
    private _handler;
    private _retryDict;
    constructor(handler: ILoaderHandler);
    loadGroups(groups: (string | IGroupParams)[]): void;
}
