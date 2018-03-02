/**
 * 简单数组乱序
 *
 * @export
 * @template T
 * @param {T} a
 * @returns {T}
 */
export declare function shuffle<T extends any[]>(a: T): T;
/**
 * 从数组指定范围内随机取出指定数量的不重复元素
 * ArrayUtils.randomize([0,1,2,3,4,5,6,7,8,9], 3, 2, 7);
 * //返回[6,2,3]
 *
 * @param arr 		原始数组
 * @param count	    数量，默认为范围内全部元素
 * @param begin 	起始位置，默认为0
 * @param end		结束位置，默认为数组长度
 */
export declare function randomize<T extends any[]>(arr: T, count?: number, begin?: number, end?: number): T;
/**
 * 进行权重随机
 *
 * @export
 * @template T
 * @param {T[]} arr 原始数组
 * @param {number[]} weight 权重数组，应保证权重数组的元素数量不小于原始数组的元素数量
 * @returns {T} 选取的结果
 */
export declare function randomizeWeight<T extends any>(arr: T[], weight: number[]): T;
/**
 * 数组去重，不会修改原数组
 *
 * @export
 * @param {any[]} list
 * @returns {any[]}
 */
export declare function unique(list: any[]): any[];
