/**
 * 将数字变为指定长度的字符串，如果数字长度不够则在前方加0以填充长度，如果数字超长则使用原始长度
 *
 * @author Raykid
 * @date 2019-04-11
 * @export
 * @param {number} num 数字
 * @param {number} [len=1] 长度，默认是1
 * @returns {string}
 */
export function numToStr(num, len) {
    if (len === void 0) { len = 1; }
    var numStr = num + "";
    // 如果长度不大于1，则该多长就多长
    if (len <= 1)
        return numStr;
    // 否则截短或者在前面补0
    var numLen = numStr.length;
    if (len <= numLen) {
        return numStr.substr(numLen - len);
    }
    else {
        for (var i = 0, lenI = len - numLen; i < lenI; i++) {
            numStr = "0" + numStr;
        }
        return numStr;
    }
}
