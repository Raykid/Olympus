/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-03-22
 * @modify date 2018-03-22
 *
 * 显示工具
*/
/**
 * 替换显示
 *
 * @export
 * @param {IBridge} bridge 要使用的桥
 * @param {*} current 被替换的显示
 * @param {*} target 替换成为的显示
 */
export function replaceDisplay(bridge, current, target) {
    // 两个皮肤必须都是隶属桥的皮肤
    if (bridge.isMySkin(target) && bridge.isMySkin(current)) {
        var parent = bridge.getParent(current);
        if (parent) {
            var index = bridge.getChildIndex(parent, current);
            bridge.addChildAt(parent, target, index);
            bridge.removeChild(parent, current);
        }
    }
}
