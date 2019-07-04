/**
 * 中间件接口
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @interface IMiddleware
 * @template T 上下文类型
 * @template P 中间件返回值类型
 */
export interface IMiddleware<T = any, P = any>
{
    (context?:T, next?:()=>Promise<P>):P|Promise<P>;
}

/**
 * 执行中间件流程
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @param {T} [context] 上下文对象
 * @returns {Promise<P>}
 */
export async function runMiddlewares<T = any, P = any>(middlewares:IMiddleware<T, P>[], context?:T, outNext?:()=>Promise<P>):Promise<P>
{
    // 处理middlewares异常
    middlewares = (middlewares || []).filter(middleware=>middleware != null);
    // 开始流程
    let curIndex:number = -1;
    const promises:Promise<P>[] = [];
    const next:()=>Promise<P> = ()=>{
        const tempIndex:number = ++ curIndex;
        const promise:Promise<P> = new Promise(async (resolve, reject)=>{
            try
            {
                if(curIndex >= middlewares.length)
                {
                    // 执行完了，如果外部还有next，则执行外部的next
                    let result:any;
                    if(outNext)
                    {
                        result = await outNext();
                    }
                    // 结束流程
                    resolve(result);
                }
                else
                {
                    // 没执行完，执行一个中间件
                    const middleware:IMiddleware<T, P> = middlewares[curIndex];
                    const curResult:P = await middleware(context, async ()=>{
                        // 这里要做一个幂等判断，防止中间件多次调用next
                        if(curIndex === tempIndex)
                        {
                            return await next();
                        }
                    });
                    // 确保next被调用过
                    if(curIndex === tempIndex)
                    {
                        next();
                    }
                    // 确保后续middleware执行完毕再结束当前middleware
                    const nextResult:P = await promises[tempIndex + 1];
                    // 优先返回当前的result，如果当前没有返回，则返回下一个中间件的返回值
                    resolve(curResult !== undefined ? curResult : nextResult);
                }
            }
            catch(err)
            {
                reject(err);
            }
        });
        promises[tempIndex] = promise;
        return promise;
    };
    // 执行第一轮
    return await next();
}

/**
 * 合并包装一个中间件执行方法
 *
 * @author Raykid
 * @date 2019-06-17
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>} 中间件执行方法，只需传入上下文对象即可
 */
export function combineMiddlewares<T = any, P = any>(middlewares:IMiddleware<T, P>[]):IMiddleware<T, P>
{
    // 处理middlewares异常
    middlewares = (middlewares || []).filter(middleware=>middleware != null);
    const middleware:IMiddleware<T, P> = (context, next)=>{
        return runMiddlewares(middlewares, context, next);
    };
    middleware["subMiddlewares"] = middlewares;
    return middleware;
}

/**
 * 将所有中间件打平
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>[]}
 */
export function flattenMiddlewares<T = any, P = any>(middlewares:IMiddleware<T, P>[]):IMiddleware<T, P>[]
{
    // 处理middlewares异常
    middlewares = (middlewares || []).filter(middleware=>middleware != null);
    const flatList:IMiddleware<T, P>[] = [];
    for(let middleware of middlewares)
    {
        const subMiddlewares:IMiddleware<T, P>[] = middleware["subMiddlewares"];
        if(subMiddlewares)
        {
            flatList.push(...flattenMiddlewares(subMiddlewares));
        }
        else
        {
            flatList.push(middleware);
        }
    }
    return flatList;
}

/**
 * 将所有中间件打平并合并成一个中间件执行器
 *
 * @author Raykid
 * @date 2019-06-18
 * @export
 * @template T 上下文类型
 * @template P 中间件返回值类型
 * @param {IMiddleware<T>[]} middlewares 中间件数组
 * @returns {IMiddleware<T, P>}
 */
export function flattenCombineMiddlewares<T = any, P = any>(middlewares:IMiddleware<T, P>[]):IMiddleware<T, P>
{
    return combineMiddlewares(flattenMiddlewares(middlewares));
}