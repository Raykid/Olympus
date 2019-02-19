/**
 * 将用户传进来的数据“变异”成为具有截获数据变更能力的数据
 * @param data 原始数据
 * @returns {any} 变异后的数据
 */
export declare function mutate(data: any): any;
/**
 * 反变异，将已经变异过的对象恢复原状
 *
 * @author Raykid
 * @date 2019-02-19
 * @export
 * @param {*} data
 * @returns {*}
 */
export declare function unmutate(data: any): any;
