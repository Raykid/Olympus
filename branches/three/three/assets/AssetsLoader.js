import { environment } from "olympus-r/engine/env/Environment";
import { version } from "olympus-r/engine/version/Version";
import { joinQueryParams } from "olympus-r/utils/URLUtil";
import { panelManager } from "olympus-r/engine/panel/PanelManager";
import { platformManager } from "olympus-r/engine/platform/PlatformManager";
import { FileLoader, ObjectLoader } from "three";
/** 资源缓存 */
var cache = {};
/**
 * 获取缓存资源
 *
 * @export
 * @param {string} url 缓存url
 * @returns {IResource}
 */
export function getCache(url) {
    return cache[url];
}
var AssetsLoader = /** @class */ (function () {
    function AssetsLoader(handler) {
        this._handler = handler;
    }
    AssetsLoader.prototype.load = function (urls) {
        if (urls)
            urls = urls.concat();
        else
            urls = [];
        var handler = this._handler;
        var retryDict = {};
        var dict = {};
        var len = urls.length;
        // 调用回调
        handler.start && handler.start();
        // 开始加载
        loadNext();
        function loadNext() {
            if (urls.length <= 0) {
                // 调用回调
                handler.complete && handler.complete(dict);
            }
            else {
                // 加载一个
                loadOne(urls.shift());
            }
        }
        function loadOne(url, randomVersion) {
            if (randomVersion === void 0) { randomVersion = false; }
            // 判断缓存
            var temp = cache[url];
            if (temp) {
                // 填充配置
                dict[url] = temp;
                // 调用回调
                handler.oneComplete && handler.oneComplete(url);
                // 加载下一个
                loadNext();
            }
            else {
                // 处理下url
                var handledUrl = environment.toCDNHostURL(url);
                // 添加版本号，有哈希值就用哈希值加载，没有就用编译版本号加载
                handledUrl = version.wrapHashUrl(handledUrl);
                // 加随机版本号
                if (randomVersion)
                    handledUrl = joinQueryParams(handledUrl, { _r: Date.now() });
                // 先用FileLoader加载文件
                new FileLoader().load(handledUrl, function (text) {
                    // 解析JSON结构
                    try {
                        var json_1 = JSON.parse(text);
                        switch (json_1.metadata.type) {
                            case "Object":
                                // 是个3D对象配置，使用ObjectLoader解析之
                                new ObjectLoader().parse(json_1, function (scene) {
                                    // 填充缓存&配置
                                    cache[url] = dict[url] = {
                                        scene: scene,
                                        configText: text
                                    };
                                    // 调用回调
                                    handler.oneComplete && handler.oneComplete(url);
                                    // 加载下一个
                                    loadNext();
                                });
                                break;
                            case "App":
                                // 是应用程序配置，先用ObjectLoader解析场景
                                new ObjectLoader().parse(json_1.scene, function (scene) {
                                    // 再用ObjectLoader解析摄像机
                                    new ObjectLoader().parse(json_1.camera, function (camera) {
                                        // 填充缓存&配置
                                        cache[url] = dict[url] = {
                                            scene: scene,
                                            configText: text,
                                            camera: camera
                                        };
                                        // 调用回调
                                        handler.oneComplete && handler.oneComplete(url);
                                        // 加载下一个
                                        loadNext();
                                    });
                                });
                                break;
                            default:
                                throw new Error(url + " 不是Three.js配置文件");
                        }
                    }
                    catch (error) {
                        // 不是加载造成的错误，无需重试，直接调用错误回调
                        handler.oneError && handler.oneError(error);
                    }
                }, function (evt) {
                    // 计算进度
                    var countLoaded = len - urls.length - 1;
                    var prg = (countLoaded + (evt.loaded / evt.total)) / len;
                    // 调用回调
                    handler.progress && handler.progress(url, prg);
                }, function (event) {
                    // 加载失败，重试之
                    onLoadError(url, event);
                });
            }
        }
        function onLoadError(url, evt) {
            var retryTimes = retryDict[url];
            if (retryTimes == null)
                retryTimes = 0;
            if (retryTimes < 3) {
                retryDict[url] = ++retryTimes;
                // 打印日志
                console.warn("加载失败，重试第" + retryTimes + "次: " + url);
                // 没到最大重试次数，将为url添加一个随机时间戳重新加回加载队列
                loadOne(url, true);
            }
            else {
                // 打印日志
                console.warn("加载失败3次，正在尝试切换CDN...");
                // 尝试切换CDN
                var allDone = environment.nextCDN();
                if (!allDone) {
                    // 重新加载
                    loadOne(url);
                }
                else {
                    // 调用模板方法
                    handler.oneError && handler.oneError(evt.error);
                    // 切换CDN失败了，弹出提示，使用户可以手动刷新页面
                    panelManager.confirm("资源加载失败[" + url + "]，点击确定刷新页面", function () {
                        platformManager.reload();
                    });
                }
            }
        }
    };
    return AssetsLoader;
}());
export default AssetsLoader;
