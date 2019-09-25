import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingScope, createBindingFromClass} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {GreetingComponent } from '@loopback/example-greeter-extension';
import { FrenchGreeter } from './greeter-fr';
import { CachingService } from './caching.service';
import { CachingInterceptor } from './interceptors';
import {CACHING_SERVICE} from './keys';

export class GreeterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.add(createBindingFromClass(CachingService, {key: CACHING_SERVICE}));
    this.add(createBindingFromClass(CachingInterceptor));
    this.component(RestExplorerComponent);
    this.component(GreetingComponent);

    this.add(createBindingFromClass(FrenchGreeter));

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
