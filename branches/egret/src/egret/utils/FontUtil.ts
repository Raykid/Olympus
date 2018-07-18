import { system } from "olympus-r/engine/system/System";

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
export function embedFont(familyName:string, stage:egret.Stage):void
{
    // 生成一个TextField，使用嵌入字体触发加载动作
    const tf:egret.TextField = new egret.TextField();
    tf.fontFamily = familyName;
    tf.visible = false;
    tf.text = "0";
    stage.addChild(tf);
    // 下一帧移除显示
    system.nextFrame(()=>{
        stage.removeChild(tf);
    });
}