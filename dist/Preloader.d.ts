declare module "utils/ObjectUtil" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-09-11
     * @modify date 2017-09-11
     *
     * 对象工具集
    */
    /**
     * populate properties
     * @param target        目标obj
     * @param sources       来源obj
     */
    export function extendObject(target: any, ...sources: any[]): any;
    /**
     * 复制对象
     * @param target 要复制的对象
     * @param deep 是否深表复制，默认浅表复制
     * @returns {any} 复制后的对象
     */
    export function cloneObject(target: any, deep?: boolean): any;
    /**
     * 生成一个随机ID
     */
    export function getGUID(): string;
    /**
     * 生成自增id（从0开始）
     * @param type
     */
    export function getAutoIncId(type: string): string;
    /**
     * 判断对象是否为null或者空对象
     * @param obj 要判断的对象
     * @returns {boolean} 是否为null或者空对象
     */
    export function isEmpty(obj: any): boolean;
    /**
     * 移除data中包含的空引用或未定义
     * @param data 要被移除空引用或未定义的对象
     */
    export function trimData(data: any): any;
    /**
     * 让child类继承自parent类
     * @param child 子类
     * @param parent 父类
     */
    export var extendsClass: (child: any, parent: any) => void;
    /**
     * 获取一个对象的对象哈希字符串
     *
     * @export
     * @param {*} target 任意对象，可以是基础类型或null
     * @returns {string} 哈希值
     */
    export function getObjectHash(target: any): string;
    /**
     * 获取多个对象的哈希字符串，会对每个对象调用getObjectHash生成单个哈希值，并用|连接
     *
     * @export
     * @param {...any[]} targets 希望获取哈希值的对象列表
     * @returns {string} 多个对象共同作用下的哈希值
     */
    export function getObjectHashs(...targets: any[]): string;
}
declare module "utils/URLUtil" {
    /**
     * 规整url
     * @param url
     */
    export function trimURL(url: string): string;
    /**
     * 检查URL是否是绝对路径（具有协议头）
     * @param url 要判断的URL
     * @returns {any} 是否是绝对路径
     */
    export function isAbsolutePath(url: string): boolean;
    /**
     * 如果url有protocol，使其与当前域名的protocol统一，否则会跨域
     * @param url 要统一protocol的url
     */
    export function validateProtocol(url: string): string;
    /**
     * 替换url中的host
     * @param url       url
     * @param host      要替换的host
     * @param forced    是否强制替换（默认false）
     */
    export function wrapHost(url: string, host: string, forced?: boolean): string;
    /**
     * 将相对于当前页面的相对路径包装成绝对路径
     * @param relativePath 相对于当前页面的相对路径
     * @param host 传递该参数会用该host替换当前host
     */
    export function wrapAbsolutePath(relativePath: string, host?: string): string;
    /**
     * 获取URL的host+pathname部分，即问号(?)以前的部分
     *
     */
    export function getHostAndPathname(url: string): string;
    /**
     * 获取URL路径（文件名前的部分）
     * @param url 要分析的URL
     */
    export function getPath(url: string): string;
    /**
     * 获取URL的文件名
     * @param url 要分析的URL
     */
    export function getName(url: string): string;
    /**
     * 解析URL
     * @param url 要被解析的URL字符串
     * @returns {any} 解析后的URLLocation结构体
     */
    export function parseUrl(url: string): URLLocation;
    /**
     * 解析url查询参数
     * @TODO 添加对jquery编码方式的支持
     * @param url url
     */
    export function getQueryParams(url: string): {
        [key: string]: string;
    };
    /**
     * 将参数连接到指定URL后面
     * @param url url
     * @param params 一个map，包含要连接的参数
     * @return string 连接后的URL地址
     */
    export function joinQueryParams(url: string, params: Object): string;
    /**
     * 将参数链接到URL的hash后面
     * @param url 如果传入的url没有注明hash模块，则不会进行操作
     * @param params 一个map，包含要连接的参数
     */
    export function joinHashParams(url: string, params: Object): string;
    export interface URLLocation {
        href: string;
        origin: string;
        protocol: string;
        host: string;
        hostname: string;
        port: string;
        pathname: string;
        search: string;
        hash: string;
    }
}
declare module "utils/VersionUtil" {
    export default class VersionUtil {
        private static _initStatus;
        private static _hashDict;
        private static _handlerList;
        /**
         * 初始化哈希版本工具
         *
         * @static
         * @param {()=>void} [handler] 回调
         * @memberof VersionUtil
         */
        static initialize(handler?: () => void): void;
        /**
         * 获取文件哈希值，如果没有文件哈希值则返回null
         *
         * @static
         * @param {string} url 文件的URL
         * @returns {string} 文件的哈希值，或者null
         * @memberof VersionUtil
         */
        static getHash(url: string): string;
        /**
         * 将url转换为哈希版本url
         *
         * @static
         * @param {string} url 原始url
         * @returns {string} 哈希版本url
         * @memberof VersionUtil
         */
        static wrapHashUrl(url: string): string;
        /**
         * 添加-r_XXX形式版本号
         *
         * @static
         * @param {string} url
         * @param {string} version 版本号，以数字和小写字母组成
         * @returns {string} 加版本号后的url，如果没有查到版本号则返回原始url
         * @memberof VersionUtil
         */
        static joinVersion(url: string, version: string): string;
        /**
         * 移除-r_XXX形式版本号
         *
         * @static
         * @param {string} url url
         * @returns {string} 移除版本号后的url
         * @memberof VersionUtil
         */
        static removeVersion(url: string): string;
    }
}
declare module "Preloader" {
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-11-01
     * @modify date 2017-11-01
     *
     * 预加载器，负责预加载过程
    */
    /**
     * 预加载方法
     *
     * @export
     * @param {string[]} jsFiles 要加载的js文件列表
     * @param {string} [host] CDN域名，不传则使用当前域名
     * @param {()=>void} [callback] 全部加载完成后的回调
     */
    export default function preload(jsFiles: string[], host?: string, callback?: () => void): void;
}
