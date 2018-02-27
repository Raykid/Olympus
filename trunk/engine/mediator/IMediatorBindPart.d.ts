import Dictionary from "../../utils/Dictionary";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-01-30
 * @modify date 2018-01-30
 *
 * 该接口规定了中介者具有的绑定功能
*/
export default interface IMediatorBindPart {
    /**
     * ViewModel引用
     *
     * @type {*}
     * @memberof IMediator
     */
    viewModel: any;
    /**
     * 绑定目标数组，key是当前编译目标对象，即currentTarget；value是命令本来所在的对象，即target
     *
     * @type {Dictionary<any, any>[]}
     * @memberof IMediator
     */
    readonly bindTargets: Dictionary<any, any>[];
}
