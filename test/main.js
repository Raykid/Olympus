/// <reference path="../dist/Olympus.d.ts"/>
define("main", ["require", "exports", "core/context/Context"], function (require, exports, Context_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-08-31
     *
     * 测试项目
    */
    Context_1.default.listen("fuck", handler, "this");
    Context_1.default.dispatch("fuck");
    function handler(msg) {
        Context_1.default.unlisten("fuck", handler, this);
        console.log(this, msg);
    }
});
