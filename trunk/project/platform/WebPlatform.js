/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 网页平台接口实现类，也是平台接口的默认类
*/
var WebPlatform = /** @class */ (function () {
    function WebPlatform() {
    }
    WebPlatform.prototype.reload = function () {
        window.location.reload(true);
    };
    return WebPlatform;
}());
export default WebPlatform;
