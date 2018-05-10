import IMediator from './IMediator';
import Mediator from './Mediator';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-05-10
 * @modify date 2018-05-10
 * 
 * 集合中介者，可用于@BindFor的变量声明类型
*/
export default class ForMediator<T extends IMediator> extends Mediator
{
    /**
     * 获取渲染器中介者数组
     * 
     * @readonly
     * @type {T[]}
     * @memberof ForMediator
     */
    public get children():T[]
    {
        return (this._children as T[]);
    }
}