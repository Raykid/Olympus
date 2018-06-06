/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-06-06
 * @modify date 2018-06-06
 *
 * 用于EUI列表的流式布局策略
*/
export default class FlowLayout extends eui.BasicLayout {
    gapH: number;
    gapV: number;
    constructor(gapH?: number, gapV?: number);
    updateDisplayList(width: number, height: number): void;
}
