var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../dist/Olympus.d.ts"/>
define("main", ["require", "exports", "Olympus"], function (require, exports, Olympus) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @author Raykid
     * @email initial_r@qq.com
     * @create date 2017-08-31
     * @modify date 2017-09-01
     *
     * 测试项目
    */
    Olympus.listen("fuck", handler, "this");
    Olympus.dispatch("fuck");
    function handler(msg) {
        Olympus.unlisten("fuck", handler, this);
        console.log(this, msg.getType());
        console.log(function () { }.prototype);
        console.log(Olympus.Context.prototype);
    }
    var Fuck = (function () {
        function Fuck() {
        }
        Fuck = __decorate([
            Injectable
        ], Fuck);
        return Fuck;
    }());
    var Fuck2 = (function () {
        function Fuck2() {
        }
        __decorate([
            Inject(Fuck)
        ], Fuck2.prototype, "fuck", void 0);
        return Fuck2;
    }());
    console.log(new Fuck2().fuck);
});
//# sourceMappingURL=main.js.map