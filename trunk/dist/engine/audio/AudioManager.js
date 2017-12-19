var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from "../../core/injector/Injector";
import { core } from "../../core/Core";
import AudioTagImpl from "./AudioTagImpl";
import AudioContextImpl from "./AudioContextImpl";
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
        this._soundImpl = new AudioTagImpl();
        this._musicImpl = new AudioContextImpl();
    }
    /**
     * 注册Sound音频实现对象
     *
     * @param {IAudio} soundImpl Sound音频实现对象
     * @memberof AudioManager
     */
    AudioManager.prototype.registerSoundImpl = function (soundImpl) {
        this._soundImpl = soundImpl;
    };
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
    AudioManager = __decorate([
        Injectable
    ], AudioManager);
    return AudioManager;
}());
export default AudioManager;
/** 再额外导出一个单例 */
export var audioManager = core.getInject(AudioManager);
