import IAudio, { AudioPlayParams } from "./IAudio";
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
export default class AudioManager {
    private static STORAGE_KEY_MUTE_SOUND;
    private static STORAGE_KEY_MUTE_MUSIC;
    constructor();
    private _soundImpl;
    /**
     * 注册Sound音频实现对象
     *
     * @param {IAudio} soundImpl Sound音频实现对象
     * @memberof AudioManager
     */
    registerSoundImpl(soundImpl: IAudio): void;
    /**
     * 获取或设置Sound类型音频静音属性
     *
     * @type {boolean}
     * @memberof AudioManager
     */
    muteSound: boolean;
    /**
     * 加载Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    loadSound(url: string): void;
    /**
     * 播放Sound音频，如果没有加载则会先行加载
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @memberof AudioManager
     */
    playSound(params: AudioPlayParams): void;
    /**
     * 跳转Sound音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    seekSound(url: string, time: number): void;
    /**
     * 停止Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    stopSound(url: string): void;
    /**
     * 暂停Sound音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    pauseSound(url: string): void;
    /**
     * 停止所有Sound音频
     *
     * @memberof AudioManager
     */
    stopAllSound(): void;
    private _musicImpl;
    /**
     * 注册Music音频实现对象
     *
     * @param {IAudio} musicImpl Music音频实现对象
     * @memberof AudioManager
     */
    registerMusicImpl(musicImpl: IAudio): void;
    /**
     * 获取或设置Music类型音频静音属性
     *
     * @type {boolean}
     * @memberof AudioManager
     */
    muteMusic: boolean;
    /**
     * 加载Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    loadMusic(url: string): void;
    /**
     * 播放Music音频，如果没有加载则会先行加载
     *
     * @param {AudioPlayParams} [params] 音频参数
     * @memberof AudioManager
     */
    playMusic(params: AudioPlayParams): void;
    /**
     * 跳转Music音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioManager
     */
    seekMusic(url: string, time: number): void;
    /**
     * 停止Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    stopMusic(url: string): void;
    /**
     * 暂停Music音频
     *
     * @param {string} url 音频地址
     * @memberof AudioManager
     */
    pauseMusic(url: string): void;
    /**
     * 停止所有Music音频
     *
     * @memberof AudioManager
     */
    stopAllMusics(): void;
}
/** 再额外导出一个单例 */
export declare const audioManager: AudioManager;
