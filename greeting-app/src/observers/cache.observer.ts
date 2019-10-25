import {inject} from '@loopback/context';
import {CachingService} from '../services/caching.service';
import {CACHING_SERVICE} from '../keys';
import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver, // The interface
} from '@loopback/core';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('caching')
export class CacheObserver implements LifeCycleObserver {
  constructor(
    @inject(CACHING_SERVICE) private cachingService: CachingService,
) {}

/**
 * This method will be invoked when the application starts
 */
async start(): Promise<void> {
  // Add your logic for start
  await this.cachingService.start();
}

/**
* This method will be invoked when the application stops
*/
async stop(): Promise<void> {
  // Add your logic for stop
  await this.cachingService.stop();
}
  
}
