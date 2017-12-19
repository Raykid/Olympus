import IPanel from "../panel/IPanel";
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-11-02
 * @modify date 2017-11-02
 *
 * 遮罩数据接口
*/
export default interface IMaskData {
    onShowMask?(): void;
    onHideMask?(): void;
    onShowLoading?(skin: any): void;
    onHideLoading?(skin: any): void;
    onShowModalMask?(popup: IPanel): void;
    onHideModalMask?(popup: IPanel): void;
}
