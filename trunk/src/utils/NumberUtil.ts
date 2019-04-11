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
export function numToStr(num:number, len:number=1):string
{
    let numStr:string = num + "";
    // 如果长度不大于1，则该多长就多长
    if(len <= 1) return numStr;
    // 否则截短或者在前面补0
    const numLen:number = numStr.length;
    if(len <= numLen)
    {
        return numStr.substr(numLen - len);
    }
    else
    {
        for(let i:number = 0, lenI:number = len - numLen; i < lenI; i++)
        {
            numStr = "0" + numStr;
        }
        return numStr;
    }
}