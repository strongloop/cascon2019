import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  inject,
  ValueOrPromise,
} from '@loopback/context';
import {CachingService} from '../services/caching.service';
import {CACHING_SERVICE} from '../keys';
import {RestBindings} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'caching'}})
export class CachingInterceptor implements Provider<Interceptor> {

  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {

    //we need to exclude two endpoints for the interceptor:
    const EXCLUDED_PATHS = ['/explorer/', '/explorer/openapi.json'];
    // And then skip them in the intercept function
    //Otherwise when hit the explorer endpoint, it's response also get cached but no timestamp in it, which breaks the cache interceptor.
    // Add pre-invocation logic here
    const httpReq = await invocationCtx.get(RestBindings.Http.REQUEST, {
      optional: true,
    });
    /* istanbul ignore if */
    // A workaround to skip the explorer
    if (!httpReq || EXCLUDED_PATHS.includes(httpReq.path)) {
      return next();
    }
    const key = httpReq.path;

    const lang = httpReq.headers['accept-language'] || 'en';
    const cachingKey = `${lang}:${key}`;
    const cachedResult = await this.cachingService.get(cachingKey);
    if (cachedResult) {
      console.error('Cache found for %s %j', cachingKey, cachedResult);
      return cachedResult;
    }

    const result = await next();

    // Add post-invocation logic here
    await this.cachingService.set(cachingKey, result);
    return result;

  }
}
