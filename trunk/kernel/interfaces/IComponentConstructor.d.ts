import IComponent from '../interfaces/IComponent';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 *
 * 组件构造接口
*/
export default interface IComponentConstructor extends Function {
    new (skin?: any): IComponent;
}
