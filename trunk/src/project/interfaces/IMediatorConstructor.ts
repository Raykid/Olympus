import IMediator from '../mediator/IMediator';

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 * 
 * 中介者构造接口
*/
export default interface IMediatorConstructor extends Function
{
    new(skin?:any):IMediator;
}