/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * 网络工具集，框架内部使用
*/
function handleObj(obj) {
    if (!obj)
        return obj;
    else if (obj instanceof Array)
        return packArray(obj);
    else if (obj.pack instanceof Function)
        return obj.pack();
    else if (typeof obj == "object")
        return packMap(obj);
    else
        return obj;
}
export function packArray(arr) {
    if (arr == null)
        return null;
    var result = arr.map(handleObj);
    return result;
}
export function parseArray(arr, cls) {
    if (arr == null)
        return [];
    // 不支持二维数组嵌套
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        var value = arr[i];
        if (cls == null) {
            // 子对象是个基础类型
            result.push(value);
        }
        else {
            // 子对象是个自定义类型
            result.push(new cls().parse(value));
        }
    }
    return result;
}
export function packMap(map) {
    if (map == null)
        return null;
    var result = {};
    for (var key in map) {
        var obj = map[key];
        result[key] = handleObj(obj);
    }
    return result;
}
export function parseMap(map, cls) {
    if (map == null)
        return {};
    // 不支持二维数组嵌套
    var result = {};
    for (var key in map) {
        var value = map[key];
        if (cls == null) {
            // 子对象是个基础类型
            result[key] = value;
        }
        else {
            // 子对象是个自定义类型
            result[key] = new cls().parse(value);
        }
    }
    return result;
}
