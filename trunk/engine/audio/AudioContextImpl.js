import { core } from "../../core/Core";
import { assetsManager } from "../assets/AssetsManager";
import { environment } from "../env/Environment";
import { system } from "../system/System";
import AudioMessage from "./AudioMessage";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 使用AudioContext实现IAudio接口的实现类
*/
var AudioContextImpl = /** @class */ (function () {
    function AudioContextImpl() {
        var _this = this;
        this._mute = false;
        this._playingDict = {};
        this._inited = false;
        this._audioCache = {};
        this._context = new (window["AudioContext"] || window["webkitAudioContext"])();
        var onInit = function () {
            window.removeEventListener("touchstart", onInit, true);
            window.removeEventListener("mousedown", onInit, true);
            // 生成一个空的音频，播放并停止，用以解除限制
            var source = _this._context.createBufferSource();
            source.buffer = _this._context.createBuffer(1, 1, 44100);
            source.connect(_this._context.destination);
            source.start();
            source.stop();
            // 要先挂起
            _this._context.suspend();
            // 设置标识符
            _this._inited = true;
            // 如果当前有正在播放的音频，全部再播放一次
            for (var url in _this._audioCache) {
                var data = _this._audioCache[url];
                if (data.status == AudioStatus.PLAYING) {
                    // 停止播放
                    _this.stop(data.playParams.url);
                    // 重新播放
                    _this.play(data.playParams);
                }
            }
        };
        // 这里监听触摸事件，一定要使用捕获阶段，否则会被某些框架阻止，比如egret
        window.addEventListener("touchstart", onInit, true);
        window.addEventListener("mousedown", onInit, true);
    }
    Object.defineProperty(AudioContextImpl.prototype, "mute", {
        /**
         * 静音状态
         *
         * @type {boolean}
         * @memberof AudioTagImpl
         */
        get: function () {
            return this._mute;
        },
        set: function (value) {
            this._mute = value;
            // 静音，暂停所有声音
            for (var url in this._playingDict) {
                if (value) {
                    // 静音，停止音频，不可调用stop方法，因为要保持播放中的音频状态
                    this._doStop(url);
                }
                else {
                    // 非静音，播放音频
                    var params = this._playingDict[url];
                    this.play(params);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 加载音频
     *
     * @param {string} url 音频地址
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.load = function (url) {
        var _this = this;
        var toUrl = environment.toCDNHostURL(url);
        // 尝试获取缓存数据
        var data = this._audioCache[toUrl];
        // 如果没有缓存才去加载
        if (!data) {
            // 使用AudioContext加载
            this._audioCache[toUrl] = data = { buffer: null, status: AudioStatus.LOADING, playParams: null, progress: null };
            // 派发加载开始事件
            core.dispatch(AudioMessage.AUDIO_LOAD_STARTED, url);
            // 开始加载
            assetsManager.loadAssets(toUrl, function (result) {
                if (result instanceof ArrayBuffer) {
                    _this._context.decodeAudioData(result, function (buffer) {
                        data.buffer = buffer;
                        // 设置状态
                        data.status = AudioStatus.PAUSED;
                        // 派发加载完毕事件
                        core.dispatch(AudioMessage.AUDIO_LOAD_ENDED, url);
                        // 如果自动播放则播放
                        if (data.playParams)
                            _this.play(data.playParams);
                    });
                }
            }, "arraybuffer");
        }
    };
    /**
     * 播放音频，如果音频没有加载则先加载再播放
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void}
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.play = function (params) {
        var _this = this;
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
                    // 设置状态
                    data.status = AudioStatus.PLAYING;
                    // 记录播放中
                    this._playingDict[toUrl] = params;
                    // 已经加载完毕，直接播放
                    data.node = this._context.createBufferSource();
                    data.node.buffer = data.buffer;
                    if (params.loop != null)
                        data.node.loop = params.loop;
                    data.node.connect(this._context.destination);
                    // 监听播放完毕
                    data.node.onended = function () {
                        var data = _this._audioCache[toUrl];
                        if (data) {
                            // 停止播放
                            _this.stop(params.url);
                            // 派发播放完毕事件
                            core.dispatch(AudioMessage.AUDIO_PLAY_ENDED, params.url);
                        }
                    };
                    // 要播放之前要起用
                    this._context.resume();
                    // 开始播放，优先取参数中的时间，没有就取默认开始时间
                    var playTime;
                    if (params && params.time != null)
                        playTime = params.time * 0.001;
                    else
                        playTime = data.playTime;
                    delete data.playTime;
                    data.node.start(playTime);
                    // 开始播放进度监测
                    var lastTime = this._context.currentTime;
                    var curTime = playTime || 0;
                    data.progress = system.enterFrame(function () {
                        var nowTime = _this._context.currentTime;
                        var deltaTime = nowTime - lastTime;
                        lastTime = nowTime;
                        if (data.status == AudioStatus.PLAYING) {
                            curTime += deltaTime * 1000;
                            var totalTime = data.node.buffer.duration * 1000;
                            core.dispatch(AudioMessage.AUDIO_PLAY_PROGRESS, params.url, curTime, totalTime);
                        }
                    });
                    // 派发播放开始事件
                    core.dispatch(AudioMessage.AUDIO_PLAY_STARTED, params.url);
                    break;
            }
        }
    };
    AudioContextImpl.prototype._doStop = function (url, time) {
        var toUrl = environment.toCDNHostURL(url);
        var data = this._audioCache[toUrl];
        if (data) {
            // 设置状态
            data.status = AudioStatus.PAUSED;
            // 取消进度监测
            data.node.onended = null;
            if (data.progress)
                data.progress.cancel();
            // 结束播放
            if (data.node) {
                try {
                    // 这里可能会报错，需要try cath
                    data.node.stop(time);
                    // 停止播音频时需要挂起
                    this._context.suspend();
                }
                catch (err) {
                    console.warn(err);
                }
                // 派发播放停止事件
                core.dispatch(AudioMessage.AUDIO_PLAY_STOPPED, url);
            }
        }
    };
    /**
     * 暂停音频（不会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.pause = function (url) {
        this._doStop(url);
        // 移除播放中
        var toUrl = environment.toCDNHostURL(url);
        delete this._playingDict[toUrl];
    };
    /**
     * 停止音频（会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.stop = function (url) {
        this._doStop(url, 0);
        // 移除播放中
        var toUrl = environment.toCDNHostURL(url);
        delete this._playingDict[toUrl];
    };
    /**
     * 停止所有音频
     *
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.stopAll = function () {
        for (var url in this._audioCache) {
            this.stop(url);
        }
    };
    /**
     * 跳转音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioContextImpl
     */
    AudioContextImpl.prototype.seek = function (url, time) {
        var toUrl = environment.toCDNHostURL(url);
        var data = this._audioCache[toUrl];
        if (data) {
            var params = data.playParams;
            if (data.status == AudioStatus.PLAYING) {
                // 停止重新播放
                this.stop(url);
                params.time = time;
                this.play(params);
            }
            else {
                data.playTime = time;
            }
        }
    };
    return AudioContextImpl;
}());
export default AudioContextImpl;
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
