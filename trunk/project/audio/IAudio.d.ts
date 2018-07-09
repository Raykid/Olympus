/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-10-30
 * @modify date 2017-10-30
 *
 * 音频接口
*/
export default interface IAudio {
    mute: boolean;
    /**
     * 加载音频
     *
     * @param {string} url 音频URL
     * @memberof IAudio
     */
    load(url: string): void;
    /**
     * 播放音频，如果音频没有加载则先加载再播放
     *
     * @param {AudioPlayParams} params 音频播放参数
     * @returns {void}
     * @memberof IAudio
     */
    play(params: AudioPlayParams): void;
    /**
     * 暂停音频（不会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof IAudio
     */
    pause(url: string): void;
    /**
     * 停止音频（会重置进度）
     *
     * @param {string} url 音频URL
     * @memberof IAudio
     */
    stop(url: string): void;
    /**
     * 停止所有音频
     *
     * @memberof IAudio
     */
    stopAll(): void;
    /**
     * 跳转音频进度
     *
     * @param {string} url 音频URL
     * @param {number} time 要跳转到的音频位置，毫秒值
     * @memberof IAudio
     */
    seek(url: string, time: number): void;
}
export interface AudioPlayParams {
    /**
     * 音频地址
     *
     * @type {string}
     * @memberof AudioPlayParams
     */
    url: string;
    /**
     * 播放启动的时间戳
     *
     * @type {number}
     * @memberof AudioPlayParams
     */
    time?: number;
    /**
     * 是否循环，默认为false
     *
     * @type {boolean}
     * @memberof AudioPlayParams
     */
    loop?: boolean;
    /**
     * 是否播放前关闭其他声音，默认为false，与important无法同时为true
     *
     * @type {boolean}
     * @memberof AudioPlayParams
     */
    stopOthers?: boolean;
}
