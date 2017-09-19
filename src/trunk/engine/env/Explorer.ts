import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-05
 * @modify date 2017-09-05
 * 
 * Explorer类记录浏览器相关数据
*/

/**
 * 浏览器类型枚举
 * 
 * @enum {number}
 */
export enum ExplorerType
{
    IE,
    EDGE,
    OPERA,
    FIREFOX,
    SAFARI,
    CHROME,
    OTHERS
}

@Injectable
export default class Explorer
{
    private _type:ExplorerType;
    /**
     * 获取浏览器类型枚举值
     * 
     * @readonly
     * @type {ExplorerType}
     * @memberof Explorer
     */
    public get type():ExplorerType
    {
        return this._type;
    }

    private _typeStr:string;
    /**
     * 获取浏览器类型字符串
     * 
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    public get typeStr():string
    {
        return this._typeStr;
    }

    private _version:string;
    /**
     * 获取浏览器版本
     * 
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    public get version():string
    {
        return this._version;
    }

    private _bigVersion:string;
    /**
     * 获取浏览器大版本
     * 
     * @readonly
     * @type {string}
     * @memberof Explorer
     */
    public get bigVersion():string
    {
        return this._bigVersion;
    }

    public constructor()
    {
        //取得浏览器的userAgent字符串
        var userAgent: string = navigator.userAgent;
        // 判断浏览器类型
        var regExp: RegExp;
        var result: RegExpExecArray;
        if (window["ActiveXObject"] != null)
        {
            // IE浏览器
            this._type = ExplorerType.IE;
            // 获取IE版本号
            regExp = new RegExp("MSIE ([^ ;\\)]+);");
            result = regExp.exec(userAgent);
            if (result != null)
            {
                // 是IE8以前
                this._version = result[1];
            }
            else
            {
                // 是IE9以后
                regExp = new RegExp("rv:([^ ;\\)]+)");
                result = regExp.exec(userAgent);
                this._version = result[1];
            }
        }
        else if (userAgent.indexOf("Edge") > -1)
        {
            // Edge浏览器
            this._type = ExplorerType.EDGE;
            // 获取Edge版本号
            regExp = new RegExp("Edge/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Firefox") > -1)
        {
            // Firefox浏览器
            this._type = ExplorerType.FIREFOX;
            // 获取Firefox版本号
            regExp = new RegExp("Firefox/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Opera") > -1)
        {
            // Opera浏览器
            this._type = ExplorerType.OPERA;
            // 获取Opera版本号
            regExp = new RegExp("OPR/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Chrome") > -1)
        {
            // Chrome浏览器
            this._type = ExplorerType.CHROME;
            // 获取Crhome版本号
            regExp = new RegExp("Chrome/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else if (userAgent.indexOf("Safari") > -1)
        {
            // Safari浏览器
            this._type = ExplorerType.SAFARI;
            // 获取Safari版本号
            regExp = new RegExp("Safari/([^ ;\\)]+)");
            result = regExp.exec(userAgent);
            this._version = result[1];
        }
        else
        {
            // 其他浏览器
            this._type = ExplorerType.OTHERS;
            // 随意设置一个版本号
            this._version = "0.0";
        }
        // 赋值类型字符串
        this._typeStr = ExplorerType[this._type];
        // 赋值大版本号
        this._bigVersion = this._version.split(".")[0];
    }
}
/** 再额外导出一个单例 */
export const explorer:Explorer = core.getInject(Explorer);