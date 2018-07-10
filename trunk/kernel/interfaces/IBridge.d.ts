import IComponent from './IComponent';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-08-31
 * @modify date 2017-08-31
 *
 * 这是表现层桥接口，不同渲染引擎的表现层都需要实现该接口以接入Olympus框架
*/
export default interface IBridge {
    /**
     * 获取表现层类型名称
     *
     * @readonly
     * @type {string}
     * @memberof IBridge
     */
    readonly type: string;
    /**
     * 获取包装器对象，即整个渲染区的父级容器，例如包含DOM根节点的div节点
     *
     * @type {*}
     * @memberof IBridge
     */
    readonly wrapper: any;
    /**
     * 获取根显示节点
     *
     * @readonly
     * @type {*}
     * @memberof IBridge
     */
    readonly root: any;
    /**
     * 判断传入的skin是否是属于该表现层桥的
     *
     * @param {*} skin 皮肤实例
     * @return {boolean} 是否数据该表现层桥
     * @memberof IBridge
     */
    isMySkin(skin: any): boolean;
    /**
     * 同步皮肤，用于组件变身后的重新定位
     *
     * @param {*} current 当前皮肤
     * @param {*} target 替换的皮肤
     * @memberof IBridge
     */
    syncSkin(current: any, target: any): void;
    /**
     * 包装皮肤
     *
     * @param {IComponent} comp 组件
     * @param {*} skin 原始皮肤
     * @returns {*} 包装后的皮肤
     * @memberof IBridge
     */
    wrapSkin(comp: IComponent, skin: any): any;
    /**
     * 替换皮肤，用于组件变身时不同表现层桥的处理
     *
     * @param {IComponent} comp 组件
     * @param {*} current 当前皮肤
     * @param {*} target 要替换的皮肤
     * @returns {*} 替换完毕的皮肤
     * @memberof IBridge
     */
    replaceSkin(comp: IComponent, current: any, target: any): any;
    /**
     * 创建一个空的显示对象
     *
     * @returns {*}
     * @memberof IBridge
     */
    createEmptyDisplay(): any;
    /**
     * 添加显示
     *
     * @param {*} parent 要添加到的父容器
     * @param {*} target 被添加的显示对象
     * @return {*} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChild(parent: any, target: any): any;
    /**
     * 按索引添加显示
     *
     * @param {*} parent 要添加到的父容器
     * @param {*} target 被添加的显示对象
     * @param {number} index 要添加到的父级索引
     * @return {*} 返回被添加的显示对象
     * @memberof IBridge
     */
    addChildAt(parent: any, target: any, index: number): any;
    /**
     * 移除显示对象
     *
     * @param {*} parent 父容器
     * @param {*} target 被移除的显示对象
     * @return {*} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChild(parent: any, target: any): any;
    /**
     * 按索引移除显示
     *
     * @param {*} parent 父容器
     * @param {number} index 索引
     * @return {*} 返回被移除的显示对象
     * @memberof IBridge
     */
    removeChildAt(parent: any, index: number): any;
    /**
     * 移除所有显示对象
     *
     * @param {*} parent 父容器
     * @memberof IBridge
     */
    removeChildren(parent: any): void;
    /**
     * 获取父容器
     *
     * @param {*} target 指定显示对象
     * @return {*} 父容器
     * @memberof IBridge
     */
    getParent(target: any): any;
    /**
     * 获取指定索引处的显示对象
     *
     * @param {*} parent 父容器
     * @param {number} index 指定父级索引
     * @return {*} 索引处的显示对象
     * @memberof IBridge
     */
    getChildAt(parent: any, index: number): any;
    /**
     * 获取显示索引
     *
     * @param {*} parent 父容器
     * @param {*} target 子显示对象
     * @return {number} target在parent中的索引
     * @memberof IBridge
     */
    getChildIndex(parent: any, target: any): number;
    /**
     * 通过名称获取显示对象
     *
     * @param {*} parent 父容器
     * @param {string} name 对象名称
     * @return {*} 显示对象
     * @memberof IBridge
     */
    getChildByName(parent: any, name: string): any;
    /**
     * 获取子显示对象数量
     *
     * @param {*} parent 父容器
     * @return {number} 子显示对象数量
     * @memberof IBridge
     */
    getChildCount(parent: any): number;
    /**
     * 监听事件，从这个方法监听的事件会在中介者销毁时被自动移除监听
     *
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    mapListener(target: any, type: string, handler: Function, thisArg?: any): void;
    /**
     * 注销监听事件
     *
     * @param {*} target 事件目标对象
     * @param {string} type 事件类型
     * @param {Function} handler 事件处理函数
     * @param {*} [thisArg] this指向对象
     * @memberof IBridge
     */
    unmapListener(target: any, type: string, handler: Function, thisArg?: any): void;
    /**
     * 为绑定的列表显示对象包装一个渲染器创建回调
     *
     * @param {*} target BindFor指令指向的显示对象
     * @param {(key?:any, value?:any, renderer?:any)=>void} rendererHandler 渲染器创建回调
     * @returns {*} 返回一个备忘录对象，会在赋值时提供
     * @memberof IBridge
     */
    wrapBindFor(target: any, rendererHandler: (key?: any, value?: any, renderer?: any) => void): any;
    /**
     * 为列表显示对象赋值
     *
     * @param {*} target BindFor指令指向的显示对象
     * @param {*} datas 数据集合
     * @param {*} memento wrapBindFor返回的备忘录对象
     * @memberof IBridge
     */
    valuateBindFor(target: any, datas: any, memento: any): void;
    /**
     * 初始化表现层桥，可以没有该方法，没有该方法则表示该表现层无需初始化
     *
     * @param {()=>void} complete 初始化完毕后的回调
     * @memberof IBridge
     */
    init?(complete: (bridge: IBridge) => void): void;
}
