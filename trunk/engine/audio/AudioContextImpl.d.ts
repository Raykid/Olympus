import IAudio, { AudioPlayParams } from "./IAudio";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 使用AudioContext实现IAudio接口的实现类
*/
export default class AudioContextImpl implements IAudio {
    private _mute;
    private _playingDict;
    /**
     * 静音状态
     *
     * @type {boolean}
     * @memberof AudioTagImpl
     */
    mute: boolean;
    private _context;
    private _inited;
    private _audioCache;
    constructor();
    /**
     * 加载音频
     *
     * @param {string} url 音频地址
     * @memberof AudioContextImpl
     */
    load(url: string): void;
    /**
     * 播放音频，如果音频没有加载则先加载再播放
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void}
     * @memberof AudioContextImpl
     */
    play(params: AudioPlayParams): void;
    private _doStop(url, time?);
    /**
     * 暂停音频（不会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    pause(url: string): void;
    /**
     * 停止音频（会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof AudioContextImpl
     */
    stop(url: string): void;
    /**
     * 停止所有音频
     *
     * @memberof AudioContextImpl
     */
    stopAll(): void;
    /**
     * 跳转音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof AudioContextImpl
     */
    seek(url: string, time: number): void;
}
