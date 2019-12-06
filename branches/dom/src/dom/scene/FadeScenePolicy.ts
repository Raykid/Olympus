import { Easing, Tween } from "@tweenjs/tween.js";
import IScene from "olympus-r/engine/scene/IScene";
import IScenePolicy from "olympus-r/engine/scene/IScenePolicy";

/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-22
 * @modify date 2017-09-22
 * 
 * 淡入淡出场景切换策略
*/
export default class FadeScenePolicy implements IScenePolicy
{
    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    public switch(from?:IScene, to?:IScene):Promise<void>
    {
        return new Promise(resolve=>{
            if(from)
            {
                // from所在bridge应该在最上层显示
                from.bridge.htmlWrapper.style.zIndex = "2147483647";
                // 显示to
                if(to) to.skin.style.display = "";
                // 添加显示
                var position = from.skin.style.position;
                var left = from.skin.style.left;
                var top = from.skin.style.top;
                var width = from.skin.style.width;
                var height = from.skin.style.height;
                var opacity = from.skin.style.opacity;
                var zIndex = from.skin.style.zIndex;
                from.skin.style.position = "absolute";
                from.skin.style.left = "0";
                from.skin.style.top = "0";
                from.skin.style.width = "100%";
                from.skin.style.height = "100%";
                from.skin.style.opacity = "1";
                from.skin.style.zIndex = "2147483647";
                from.skin.style.display = "";
                // 开始淡出
                new Tween(from.skin.style)
                    .end()
                    .stop()
                    .to({ opacity: "0" }, 300)
                    .easing(Easing.Linear.None)
                    .onComplete(function () {
                        if(!from.disposed)
                        {
                            // 隐藏from
                            from.skin.style.display = "none";
                            // 恢复from
                            from.skin.style.position = position;
                            from.skin.style.left = left;
                            from.skin.style.top = top;
                            from.skin.style.width = width;
                            from.skin.style.height = height;
                            from.skin.style.opacity = opacity;
                            from.skin.style.zIndex = zIndex;
                            // 恢复z-index
                            from.bridge.htmlWrapper.style.zIndex = "";
                        }
                        // 调用回调
                        resolve();
                    })
                    .start();
            }
            else
            {
                // 调用回调
                resolve();
            }
        });
    }
}