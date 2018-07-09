/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-18
 * @modify date 2017-09-18
 *
 * 这个文件是给全局设置一个IConstructor接口而设计的
*/
interface IConstructor extends Function {
    new (...args: any[]): any;
}
