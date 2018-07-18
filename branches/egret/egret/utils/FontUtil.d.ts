/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-07-18
 * @modify date 2018-07-18
 *
 * 字体工具集
*/
/**
 * 嵌入一个字体，会触发提前加载字体文件，否则加载动作会推迟到首次使用，可能会造成乱码
 *
 * @export
 * @param {string} familyName
 */
export declare function embedFont(familyName: string, stage: egret.Stage): void;
