import * as tslib_1 from "tslib";
import { core } from "../../core/Core";
import { Injectable } from "../../core/injector/Injector";
import Shell from "../env/Shell";
import EngineMessage from "../message/EngineMessage";
import AudioContextImpl from "./AudioContextImpl";
import AudioTagImpl from "./AudioTagImpl";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 音频管理器，音频接口被强行分为两部分：Sound和Music。
 * Sound：使用Audio标签播放，可以跨域播放但可能会被某些浏览器限制，必须在点击事件处理函数中播放
 * Music：使用AudioContext播放，可以一定程度上越过点击事件检查，但无法跨域播放，适合播放背景音乐
*/
var AudioManager = /** @class */ (function () {
    function AudioManager() {
        var _this = this;
        this._soundImpl = new AudioTagImpl();
        // 为WebAudio做兼容处理
        window["AudioContext"] = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"] || window["msAudioContext"];
        // 由于IE可能不支持AudioContext，因此如果是IE则要改用Audio标签实现
        this._musicImpl = (window["AudioContext"] ? new AudioContextImpl() : this._soundImpl);
        core.listen(EngineMessage.INITIALIZED, function () {
            // 读取持久化记录
            var shell = core.getInject(Shell);
            _this.muteSound = (shell.localStorageGet(AudioManager_1.STORAGE_KEY_MUTE_SOUND) === "true");
            _this.muteMusic = (shell.localStorageGet(AudioManager_1.STORAGE_KEY_MUTE_MUSIC) === "true");
        });
    }
    AudioManager_1 = AudioManager;
    /**
     * 注册Sound音频实现对象
     *
     * @param {IAudio} soundImpl Sound音频实现对象
     * @memberof AudioManager
     */
    AudioManager.prototype.registerSoundImpl = function (soundImpl) {
        this._soundImpl = soundImpl;
    };
    Object.defineProperty(AudioManager.prototype, "muteSound", {
        /**
         * 获取或设置Sound类型音频静音属性
         *
         * @type {boolean}
         * @memberof AudioManager
         */
        get: function () {
            return this._soundImpl.mute;
        },
        set: function (value) {
            if (value === this._soundImpl.mute)
                return;
            this._soundImpl.mute = value;
            // 持久化
            var shell = core.getInject(Shell);
            shell.localStorageSet(AudioManager_1.STORAGE_KEY_MUTE_SOUND, value + "");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 加载Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.loadSound = function (url) {
        this._soundImpl.load(url);
    };
    /**
     * 播放Sound音频，如果没有加载则会先行加载
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @memberof AudioManager
     */
    AudioManager.prototype.playSound = function (params) {
        // 判断静音
        if (this.muteSound)
            return;
        // 停止其他音频
        if (params.stopOthers) {
            this.stopAllSound();
            this.stopAllMusics();
        }
        this._soundImpl.play(params);
    };
    /**
     * 跳转Sound音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    AudioManager.prototype.seekSound = function (url, time) {
        this._soundImpl.seek(url, time);
    };
    /**
     * 停止Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.stopSound = function (url) {
        this._soundImpl.stop(url);
    };
    /**
     * 暂停Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.pauseSound = function (url) {
        this._soundImpl.pause(url);
    };
    /**
     * 停止所有Sound音频
     *
     * @memberof AudioManager
     */
    AudioManager.prototype.stopAllSound = function () {
        this._soundImpl.stopAll();
    };
    /**
     * 注册Music音频实现对象
     *
     * @param {IAudio} musicImpl Music音频实现对象
     * @memberof AudioManager
     */
    AudioManager.prototype.registerMusicImpl = function (musicImpl) {
        this._musicImpl = musicImpl;
    };
    Object.defineProperty(AudioManager.prototype, "muteMusic", {
        /**
         * 获取或设置Music类型音频静音属性
         *
         * @type {boolean}
         * @memberof AudioManager
         */
        get: function () {
            return this._musicImpl.mute;
        },
        set: function (value) {
            if (value === this._musicImpl.mute)
                return;
            this._musicImpl.mute = value;
            // 持久化
            var shell = core.getInject(Shell);
            shell.localStorageSet(AudioManager_1.STORAGE_KEY_MUTE_MUSIC, value + "");
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 加载Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.loadMusic = function (url) {
        this._musicImpl.load(url);
    };
    /**
     * 播放Music音频，如果没有加载则会先行加载
     *
     * @param {AudioPlayParams} [params] 音频参数
     * @memberof AudioManager
     */
    AudioManager.prototype.playMusic = function (params) {
        // 判断静音
        if (this.muteMusic)
            return;
        // 停止其他音频
        if (params.stopOthers) {
            this.stopAllSound();
            this.stopAllMusics();
        }
        this._musicImpl.play(params);
    };
    /**
     * 跳转Music音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    AudioManager.prototype.seekMusic = function (url, time) {
        this._musicImpl.seek(url, time);
    };
    /**
     * 停止Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.stopMusic = function (url) {
        this._musicImpl.stop(url);
    };
    /**
     * 暂停Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    AudioManager.prototype.pauseMusic = function (url) {
        this._musicImpl.pause(url);
    };
    /**
     * 停止所有Music音频
     *
     * @memberof AudioManager
     */
    AudioManager.prototype.stopAllMusics = function () {
        this._musicImpl.stopAll();
    };
    AudioManager.STORAGE_KEY_MUTE_SOUND = "AudioManager::muteSound";
    AudioManager.STORAGE_KEY_MUTE_MUSIC = "AudioManager::muteMusic";
    AudioManager = AudioManager_1 = tslib_1.__decorate([
        Injectable,
        tslib_1.__metadata("design:paramtypes", [])
    ], AudioManager);
    return AudioManager;
    var AudioManager_1;
}());
export default AudioManager;
/** 再额外导出一个单例 */
export var audioManager = core.getInject(AudioManager);
