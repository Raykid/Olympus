/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-25
 * @modify date 2017-10-25
 * 
 * 插件接口
*/
export default interface IPlugin
{
    /** 初始化插件，插件会在框架初始化完毕，首个模块打开前调用 */
    initPlugin():void;
}