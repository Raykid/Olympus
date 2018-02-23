import { getCache } from "../assets/AssetsLoader";
import { Camera, WebGLRenderer, OrthographicCamera, PerspectiveCamera } from "three";
import ThreeBridge from "../../ThreeBridge";
import { bridgeManager } from "olympus-r/engine/bridge/BridgeManager";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-09
 * @modify date 2017-10-09
 *
 * Egret皮肤工具集
*/
function breadthFirstTraverse(object, callback) {
    var stop = false;
    var children = object.children;
    // 遍历子对象
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        stop = callback(child);
        if (stop)
            break;
    }
    // 递归遍历子对象
    if (!stop) {
        for (var _a = 0, children_2 = children; _a < children_2.length; _a++) {
            var child = children_2[_a];
            stop = breadthFirstTraverse(child, callback);
            if (stop)
                break;
        }
    }
    return stop;
}
function getCamera(resource) {
    if (resource.camera)
        return resource.camera;
    var camera;
    // 广度优先遍历，因为摄像机一般都放在比较表面的层级
    breadthFirstTraverse(resource.scene, function (object) {
        var stop = false;
        if (object instanceof Camera) {
            camera = object;
            stop = true;
        }
        return stop;
    });
    return camera;
}
function createRenderer() {
    var bridge = bridgeManager.getBridge(ThreeBridge.TYPE);
    var initParams = bridge.initParams;
    var renderer = new WebGLRenderer(initParams.rendererParams);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0, 0);
    initParams.container.appendChild(renderer.domElement);
    return renderer;
}
export function wrapSkin(mediator, url) {
    var bridge = bridgeManager.getBridge(ThreeBridge.TYPE);
    mediator.bridge = bridge;
    var skin;
    // 声明渲染回调
    var handler = {
        render: function () {
            skin.renderer.render(skin.scene, skin.camera);
        },
        resize: function (width, height) {
            if (skin.camera instanceof OrthographicCamera) {
                // 无透视摄像机需要重设边框范围
                skin.camera.left = width * -0.5;
                skin.camera.right = width * 0.5;
                skin.camera.top = height * 0.5;
                skin.camera.bottom = height * -0.5;
                skin.camera.updateProjectionMatrix();
            }
            else if (skin.camera instanceof PerspectiveCamera) {
                // 透视摄像机需要重设边框比例
                skin.camera.aspect = width / height;
                skin.camera.updateProjectionMatrix();
            }
            // 设置渲染器
            skin.renderer.setSize(window.innerWidth, window.innerHeight);
        }
    };
    // 篡改mediator的onOpen方法
    var oriOnOpen = mediator.hasOwnProperty("onOpen") ? mediator.onOpen : null;
    mediator.onOpen = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 赋值皮肤
        var resource = getCache(url);
        if (resource) {
            skin = {
                scene: resource.scene,
                camera: getCamera(resource),
                renderer: createRenderer()
            };
        }
        mediator.skin = skin;
        // 转发ui引用
        var configText = resource.configText;
        // 从配置字符串中读取所有name
        var names = [];
        var regName = /"name"\s*:\s*"(\w+)"/g;
        var regRes;
        while (regRes = regName.exec(configText)) {
            names.push(regRes[1]);
        }
        // 然后从实体中获取所有引用
        var scene = skin.scene;
        for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
            var name_1 = names_1[_a];
            mediator[name_1] = scene.getObjectByName(name_1);
        }
        // 添加渲染回调
        bridge.addRenderHandler(handler);
        // 恢复原始方法
        if (oriOnOpen)
            mediator.onOpen = oriOnOpen;
        else
            delete mediator.onOpen;
        // 调用原始方法
        mediator.onOpen.apply(this, args);
    };
    // 篡改mediator的dispose方法
    var oriDispose = mediator.hasOwnProperty("dispose") ? mediator.dispose : null;
    mediator.dispose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        // 恢复原始方法
        if (oriDispose)
            mediator.dispose = oriDispose;
        else
            delete mediator.dispose;
        // 调用原始方法
        mediator.dispose.apply(this, args);
        // 移除渲染回调
        bridge.removeRenderHandler(handler);
        // 销毁渲染器
        var canvas = skin.renderer.domElement;
        if (canvas.parentElement)
            canvas.parentElement.removeChild(canvas);
        skin.renderer["dispose"] && skin.renderer["dispose"]();
    };
    return skin;
}
