import Dictionary from '../../utils/Dictionary';
import ComponentStatus from '../enums/ComponentStatus';
import IDisposable from './IDisposable';
import IHasBridge from './IHasBridge';
import IObservable from './IObservable';
import IOpenClose from './IOpenClose';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-05
 * @modify date 2018-07-05
 * 
 * 组件接口
*/
export default interface IComponent extends IHasBridge, IObservable, IOpenClose, IDisposable
{
    /******************** 下面是组件的基础接口 ********************/

    /**
     * 皮肤
     * 
     * @readonly
     * @type {*}
     * @memberof IComponent
     */
    skin:any;

    /**
     * 组件状态
     *
     * @type {ComponentStatus}
     * @memberof IComponent
     */
    status:ComponentStatus;

    /**
     * 监听事件，从这个方法监听的事件会在组件销毁时被自动移除监听
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IComponent
     */
    mapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    
    /**
     * 注销监听事件
     * 
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IComponent
     */
    unmapListener(target:any, type:string, handler:Function, thisArg?:any):void;
    
    /**
     * 注销所有注册在当前组件上的事件监听
     * 
     * @memberof IComponent
     */
    unmapAllListeners():void;

    /**
     * 当打开时调用
     * 
     * @param {*} [data] 可能的打开参数
     * @returns {*} 若返回对象则使用该对象替换传入的data进行后续开启操作
     * @memberof IComponent
     */
    onOpen(data?:any):any;

    /**
     * 当关闭时调用
     * 
     * @param {*} [data] 可能的关闭参数
     * @memberof IComponent
     */
    onClose(data?:any):void;


    /******************** 下面是组件的绑定接口 ********************/

    /**
     * ViewModel引用
     * 
     * @type {*}
     * @memberof IComponent
     */
    viewModel:any;

    /**
     * 绑定目标数组，key是当前编译目标对象，即currentTarget；value是命令本来所在的对象，即target
     * 
     * @type {Dictionary<any, any>[]}
     * @memberof IComponent
     */
    readonly bindTargets:Dictionary<any, any>[];


    /******************** 下面是组件的组件树接口 ********************/
    
    /**
     * 获取父组件
     * 
     * @type {IComponent}
     * @memberof IComponent
     */
    parent:IComponent;

    /**
     * 获取根级组件（当做模块直接被打开的组件）
     * 
     * @type {IComponent}
     * @memberof IComponent
     */
    readonly root:IComponent;

    /**
     * 获取所有子组件
     * 
     * @type {IComponent[]}
     * @memberof IComponent
     */
    readonly children:IComponent[];

    /**
     * 托管子组件
     * 
     * @param {IComponent} child 要托管的组件
     * @memberof IComponent
     */
    delegate(child:IComponent):void;

    /**
     * 取消托管子组件
     * 
     * @param {IComponent} child 要取消托管的组件
     * @memberof IComponent
     */
    undelegate(child:IComponent):void;
    
    /**
     * 判断指定组件是否包含在该组件里（判断范围包括当前组件和子孙级组件）
     * 
     * @param {IComponent} child 要判断的组件
     * @returns {boolean} 
     * @memberof IComponent
     */
    contains(child:IComponent):boolean;
}