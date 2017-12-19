import { core } from "../../core/Core";
import AudioMessage from "./AudioMessage";
import { environment } from "../env/Environment";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 使用Audio标签实现IAudio接口的实现类
*/
var AudioTagImpl = /** @class */ (function () {
    function AudioTagImpl() {
        this._audioCache = {};
    }
    /**
     * 加载音频
     *
     * @param {string} url 音频地址
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.load = function (url) {
        var _this = this;
        var toUrl = environment.toCDNHostURL(url);
        // 尝试获取缓存数据
        var data = this._audioCache[toUrl];
        // 如果没有缓存才去加载
        if (!data) {
            // 使用Audio标签加载
            var node = document.createElement("audio");
            node.src = toUrl;
            // 保存数据
            this._audioCache[toUrl] = data = { node: node, status: AudioStatus.LOADING, playParams: null };
            // 监听加载
            node.onloadeddata = function () {
                // 记录加载完毕
                data.status = AudioStatus.PAUSED;
                // 如果自动播放则播放
                if (data.playParams)
                    _this.play(data.playParams);
            };
            node.onended = function () {
                // 派发播放完毕事件
                core.dispatch(AudioMessage.AUDIO_PLAY_ENDED, url);
            };
        }
    };
    /**
     * 播放音频，如果音频没有加载则先加载再播放
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void}
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.play = function (params) {
        var toUrl = environment.toCDNHostURL(params.url);
        // 尝试获取缓存数据
        var data = this._audioCache[toUrl];
        if (!data) {
            // 没有加载过，开始加载音频
            this.load(params.url);
            // 设置播放参数
            this._audioCache[toUrl].playParams = params;
        }
        else {
            switch (data.status) {
                case AudioStatus.LOADING:
                    // 正在加载中，替换自动播放参数
                    data.playParams = params;
                    break;
                case AudioStatus.PLAYING:
                    // 正在播放，关闭后再播放
                    this.stop(params.url);
                    this.play(params);
                    break;
                case AudioStatus.PAUSED:
                    // 已经加载完毕，暂停中，直接播放
                    if (params.stopOthers)
                        this.stopAll();
                    if (params.loop != null)
                        data.node.loop = params.loop;
                    if (params.time != null)
                        data.node.currentTime = params.time * 0.001;
                    // 监听播放进度
                    data.node.ontimeupdate = function (evt) {
                        // 只有播放状态可以派发PROGRESS事件
                        if (data.status == AudioStatus.PLAYING) {
                            // 我们规定使用毫秒值作为单位
                            var curTime = data.node.currentTime * 1000;
                            var totalTime = data.node.duration * 1000;
                            // 派发播放进度事件
                            core.dispatch(AudioMessage.AUDIO_PLAY_PROGRESS, curTime, totalTime);
                        }
                    };
                    // 开始播放
                    data.node.play();
                    // 设置状态
                    data.status = AudioStatus.PLAYING;
                    // 派发播放开始事件
                    core.dispatch(AudioMessage.AUDIO_PLAY_STARTED, params.url);
                    break;
            }
        }
    };
    AudioTagImpl.prototype._doStop = function (url, time) {
        var toUrl = environment.toCDNHostURL(url);
        var data = this._audioCache[toUrl];
        if (data) {
            data.node.autoplay = false;
            data.node.pause();
            // 设置停止时间
            if (time != null)
                data.node.currentTime = time * 0.001;
            // 设置状态
            data.status = AudioStatus.PAUSED;
            // 派发播放停止事件
            core.dispatch(AudioMessage.AUDIO_PLAY_STOPPED, url);
        }
    };
    /**
     * 暂停音频（不会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.pause = function (url) {
        this._doStop(url);
    };
    /**
     * 停止音频（会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.stop = function (url) {
        this._doStop(url, 0);
    };
    /**
     * 停止所有音频
     *
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.stopAll = function () {
        for (var url in this._audioCache) {
            this.stop(url);
        }
    };
    /**
     * 跳转音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioTagImpl
     */
    AudioTagImpl.prototype.seek = function (url, time) {
        var data = this._audioCache[url];
        if (data)
            data.node.currentTime = time * 0.001;
    };
    return AudioTagImpl;
}());
export default AudioTagImpl;
var AudioStatus;
(function (AudioStatus) {
    /**
     * 加载中
     */
    AudioStatus[AudioStatus["LOADING"] = 0] = "LOADING";
    /**
     * 已暂停
     */
    AudioStatus[AudioStatus["PAUSED"] = 1] = "PAUSED";
    /**
     * 播放中
     */
    AudioStatus[AudioStatus["PLAYING"] = 2] = "PLAYING";
})(AudioStatus || (AudioStatus = {}));
