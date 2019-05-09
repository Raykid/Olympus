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
    private _tempSnapshot:egret.Bitmap;

    public constructor()
    {
        this._tempSnapshot = new egret.Bitmap();
    }

    /**
     * 准备切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     */
    public prepareSwitch(from?:IScene, to?:IScene):void
    {
        if(from != null)
        {
            var root:egret.DisplayObjectContainer = from.bridge.root;
            // 截取当前屏幕
            var texture:egret.RenderTexture = new egret.RenderTexture();
            texture.drawToTexture(root);
            this._tempSnapshot.texture = texture;
            this._tempSnapshot.alpha = 1;
            root.addChild(this._tempSnapshot);
            // 移除from
            var fromDisplay:egret.DisplayObject = from.skin;
            if(fromDisplay.parent != null)
            {
                fromDisplay.parent.removeChild(fromDisplay);
            }
        }
    }

    /**
     * 切换场景时调度
     * @param {IScene<S>} [from] 切出的场景
     * @param {IScene<S>} [to] 切入的场景
     * @returns {Promise<void>}
     */
    public switch(from:IScene, to:IScene):Promise<void>
    {
        return new Promise(resolve=>{
            if(from != null)
            {
                // from所在bridge应该在最上层显示
                from.bridge.htmlWrapper.style.zIndex = "2147483647";
                // 开始淡出
                egret.Tween.removeTweens(this._tempSnapshot);
                egret.Tween.get(this._tempSnapshot).to({
                    alpha: 0
                }, 300).call(()=>{
                    // 移除截屏
                    if(this._tempSnapshot.parent != null)
                    {
                        this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                    }
                    // 回收资源
                    if(this._tempSnapshot.texture != null)
                    {
                        this._tempSnapshot.texture.dispose();
                        this._tempSnapshot.texture = null;
                    }
                    // 恢复z-index
                    from.bridge.htmlWrapper.style.zIndex = "";
                    // 调用回调
                    resolve();
                });
            }
            else
            {
                // 移除截屏
                if(this._tempSnapshot.parent != null)
                {
                    this._tempSnapshot.parent.removeChild(this._tempSnapshot);
                }
                // 调用回调
                resolve();
            }
        });
    }
}