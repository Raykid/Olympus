/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-09-19 12:30:26
 * @modify date 2018-09-19 12:30:26
 * @desc [description] 秘技工具集
*/
function getTargetCodes(cheatCode) {
    var targetCodes = [];
    if (typeof cheatCode === "string") {
        targetCodes.push.apply(targetCodes, stringToCharCodes(cheatCode));
    }
    else {
        for (var _i = 0, cheatCode_1 = cheatCode; _i < cheatCode_1.length; _i++) {
            var temp = cheatCode_1[_i];
            if (typeof temp === "number")
                targetCodes.push(temp);
            else
                targetCodes.push.apply(targetCodes, stringToCharCodes(temp));
        }
    }
    return targetCodes;
}
function stringToCharCodes(str) {
    return str.split("").map(function (char) { return char.charCodeAt(0); });
}
function getConsistency(inputCodes, targetCodes) {
    var inputCount = inputCodes.length;
    // 计算命中数量
    var hitCount;
    for (hitCount = 0; hitCount < inputCount; hitCount++) {
        var inputCode = inputCodes[hitCount];
        var targetCode = targetCodes[hitCount];
        if (inputCode == null || targetCode == null || inputCode !== targetCodes[hitCount])
            return 0;
    }
    // 返回一致性
    return hitCount / targetCodes.length;
}
export function keyboardCheat(cheatCode, handler) {
    // 整合键位列表
    var targetCodes = getTargetCodes(cheatCode);
    // 缓存键位数据
    var inputCodes = [];
    // 监听键盘事件
    window.addEventListener("keypress", function (evt) {
        // 抬起时的键值必须是栈顶键值，否则不作数
        var code = evt.charCode;
        inputCodes.push(code);
        // 判断一致性
        var consistency = getConsistency(inputCodes, targetCodes);
        if (consistency === 0) {
            // 一致性为0，匹配失败，清空缓存数组，并将当前键值推入数组
            inputCodes.splice(0, inputCodes.length, code);
        }
        else if (consistency === 1) {
            // 完全一致，调用回调并清空缓存数组
            inputCodes.splice(0, inputCodes.length);
            handler();
        }
    });
}
