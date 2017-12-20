import { query } from 'olympus-r/engine/env/Query';
import { windowExternal } from 'olympus-r/engine/env/WindowExternal';
/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-21
 * @modify date 2017-09-21
 *
 * 初始参数工具，先从windowExternal取，取不到再从query里取
*/
export default function getParam(key) {
    return (windowExternal.getParam(key) || query.getParam(key));
}
//# sourceMappingURL=InitParamsUtil.js.map