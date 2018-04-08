import * as tslib_1 from "tslib";
import { environment } from "olympus-r/engine/env/Environment";
import { panelManager } from "olympus-r/engine/panel/PanelManager";
import { platformManager } from "olympus-r/engine/platform/PlatformManager";
import { version } from "olympus-r/engine/version/Version";
var ResourceVersionController = /** @class */ (function (_super) {
    tslib_1.__extends(ResourceVersionController, _super);
    function ResourceVersionController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResourceVersionController.prototype.getVirtualUrl = function (url) {
        // 添加imgDomain
        url = environment.toCDNHostURL(url);
        // 添加版本号，有哈希值就用哈希值加载，没有就用编译版本号加载
        url = version.wrapHashUrl(url);
        // 返回url
        return url;
    };
    return ResourceVersionController;
}(RES.VersionController));
export { ResourceVersionController };
// 这里直接注册一下
RES.registerVersionController(new ResourceVersionController());
var AssetsLoader = /** @class */ (function () {
    function AssetsLoader(handler) {
        this._retryDict = {};
        this._handler = handler;
    }
    AssetsLoader.prototype.loadGroups = function (groups) {
        // 调用回调
        this._handler.start && this._handler.start();
        // 组名如果是空字符串则会导致Egret什么都不干，所以要移除空字符串的组名
        groups = groups && groups.filter(function (group) {
            if (typeof group == "string")
                return (group != "");
            else
                return (group.name != "");
        });
        // 开始加载
        var groupDict = {};
        var pgsDict;
        var len = groups ? groups.length : 0;
        if (len == 0) {
            this._handler.complete && this._handler.complete(groupDict);
        }
        else {
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, onProgress, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, onOneComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, onOneError, this);
            var temp = groups.concat();
            pgsDict = {};
            for (var i in groups) {
                var group = groups[i];
                if (typeof group == "string") {
                    pgsDict[group] = 0;
                    RES.loadGroup(group);
                }
                else {
                    pgsDict[group.name] = 0;
                    RES.loadGroup(group.name, group.priority);
                }
            }
        }
        function onProgress(evt) {
            // 填充资源字典
            var itemDict = groupDict[evt.groupName];
            if (!itemDict)
                groupDict[evt.groupName] = itemDict = {};
            itemDict[evt.resItem.name] = evt.resItem;
            // 计算总进度
            pgsDict[evt.groupName] = evt.itemsLoaded / evt.itemsTotal;
            var pgs = 0;
            for (var key in pgsDict) {
                pgs += pgsDict[key];
            }
            pgs /= len;
            // 回调
            this._handler.progress && this._handler.progress(evt.resItem, pgs);
        }
        function onOneComplete(evt) {
            // 调用单一完毕回调
            this._handler.oneComplete && this._handler.oneComplete(groupDict[evt.groupName]);
            // 测试是否全部完毕
            var index = temp.indexOf(evt.groupName);
            if (index >= 0) {
                // 移除加载组名
                temp.splice(index, 1);
                // 判断是否全部完成
                if (temp.length == 0) {
                    // 移除事件监听
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, onProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, onOneComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, onOneError, this);
                    // 调用回调
                    this._handler.complete && this._handler.complete(groupDict);
                }
            }
        }
        function onOneError(evt) {
            var groupName = evt.groupName;
            var retryTimes = this._retryDict[groupName];
            if (retryTimes == null)
                retryTimes = 0;
            if (retryTimes < 3) {
                this._retryDict[groupName] = ++retryTimes;
                // 打印日志
                console.warn("加载失败，重试第" + retryTimes + "次: " + groupName);
                // 没到最大重试次数，将为url添加一个随机时间戳重新加回加载队列
                RES.loadGroup(evt.groupName);
            }
            else {
                // 打印日志
                console.warn("加载失败3次，正在尝试切换CDN...");
                // 尝试切换CDN
                var allDone = environment.nextCDN();
                if (!allDone) {
                    // 重新加载
                    RES.loadGroup(evt.groupName);
                }
                else {
                    // 移除事件监听
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, onProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, onOneComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, onOneError, this);
                    // 调用模板方法
                    this._handler.oneError && this._handler.oneError(evt);
                    // 切换CDN失败了，弹出提示，使用户可以手动刷新页面
                    panelManager.confirm("资源组加载失败[" + groupName + "]，点击确定刷新页面", function () {
                        platformManager.reload();
                    });
                }
            }
        }
    };
    return AssetsLoader;
}());
export default AssetsLoader;
