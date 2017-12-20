/**
 * @author Raykid
 * @email initial_r@qq.com
 * @create date 2017-09-06
 * @modify date 2017-09-06
 * 
 * 这个文件的存在是为了对现有js功能打补丁修bug等
*/

/** 修复Array.findIndex会被遍历到的问题 */
if(Array.prototype.hasOwnProperty("findIndex"))
{
    var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
    if(desc.enumerable)
    {
        desc.enumerable = false;
        Object.defineProperty(Array.prototype, "findIndex", desc);
    }
}

/** 篡改Reflect.decorate方法，用于为装饰器方法打个flag，标记装饰器是否为参数化装饰 */
if(Reflect && Reflect.decorate)
{
    var oriDecorate:Function = Reflect.decorate;
    Reflect.decorate = function(...args:any[]):any
    {
        // 篡改args[0][0]（装饰器方法引用），在调用时为其提供一个this指向，指向window
        var oriRef:Function = args[0][0];
        args[0][0] = function(...args:any[]):any
        {
            return oriRef.apply(window, args);
        };
        // 调用原始方法
        var result:any = oriDecorate.apply(this, args);
        // 还原篡改项
        args[0][0] = oriRef;
        // 返回结果
        return result;
    };
}

export default {};
