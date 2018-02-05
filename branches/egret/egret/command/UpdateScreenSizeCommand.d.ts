import Command from "olympus-r/core/command/Command";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2018-02-05
 * @modify date 2018-02-05
 *
 * 这个命令是为了修复egret在display==none时获取自身尺寸是空尺寸的bug
*/
export default class UpdateScreenSizeCommand extends Command {
    exec(): void;
}
