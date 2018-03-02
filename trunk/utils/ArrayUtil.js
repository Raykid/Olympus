import Dictionary from "./Dictionary";
/**
 * 简单数组乱序
 *
 * @export
 * @template T
 * @param {T} a
 * @returns {T}
 */
export function shuffle(a) {
    var len = a.length;
    for (var i = 1; i < len; i++) {
        var end = len - i;
        var index = (Math.random() * (end + 1)) >> 0;
        var t = a[end];
        a[end] = a[index];
        a[index] = t;
    }
    return a;
}
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
export function randomize(arr, count, begin, end) {
    if (!arr || begin < 0)
        throw new Error("invalid argument");
    arr = arr.concat();
    var len = arr.length;
    end = end >> 0;
    if (!(end >= 0 && end <= len)) {
        end = len;
    }
    begin = begin >> 0;
    if (!(begin > 0)) {
        begin = 0;
    }
    count = count >> 0;
    if (!(count >= 0 && count < end - begin)) {
        count = end - begin;
    }
    var arr2 = [];
    var end2 = begin + count;
    for (var i = begin; i < end2; i++) {
        var index = (Math.random() * (end - i) + i) >> 0;
        arr2[i - begin] = arr[index];
        arr[index] = arr[i];
    }
    return arr2;
}
/**
 * 进行权重随机
 *
 * @export
 * @template T
 * @param {T[]} arr 原始数组
 * @param {number[]} weight 权重数组，应保证权重数组的元素数量不小于原始数组的元素数量
 * @returns {T} 选取的结果
 */
export function randomizeWeight(arr, weight) {
    if (!arr || !weight)
        throw new Error("invalid argument");
    if (weight.length < arr.length)
        throw new Error("权重数组的元素数量不应小于原始数组的元素数量");
    // 根据权重数组建立一个区间数组
    var regions = [];
    var sum = 0;
    for (var i in arr) {
        sum += weight[i];
        regions.push(sum);
    }
    // 随机一个位置
    var ran = Math.random() * sum;
    // 搜索该位置所属区间索引
    var index;
    for (var i = 0, len = regions.length; i < len; i++) {
        if (ran < regions[i]) {
            index = i;
            break;
        }
    }
    // 返回索引处的原始数组元素
    return arr[index];
}
/**
 * 数组去重，不会修改原数组
 *
 * @export
 * @param {any[]} list
 * @returns {any[]}
 */
export function unique(list) {
    if (!list)
        return list;
    // 初始化
    var hash = new Dictionary(), result = [];
    // 遍历当前数组
    for (var i = 0, len = list.length; i < len; i++) {
        // 如果hash表中没有当前项
        if (!hash.get(list[i])) {
            // 存入hash表
            hash.set(list[i], true);
            // 把当前数组的当前项push到临时数组里面
            result.push(list[i]);
        }
    }
    return result;
}
