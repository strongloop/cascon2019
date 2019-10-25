import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, createBindingFromClass} from '@loopback/core'; //Change this line
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import * as path from 'path';
import {MySequence} from './sequence';
import {GreetingComponent} from '@loopback/example-greeter-extension';

import {FrenchGreeter} from './greeter-fr'; //Add this line

// add these mports
import {CachingService} from './services/caching.service';
import {CACHING_SERVICE} from './keys';
import {CachingInterceptor} from './interceptors';

export class GreetingApplication extends BootMixin(
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

    // also add these lines. it binds interceptor and service to app
    this.add(createBindingFromClass(CachingService, {key: CACHING_SERVICE}));
    this.add(createBindingFromClass(CachingInterceptor));

    this.component(RestExplorerComponent);
    // add this line. It binds the greeting component (and all its artifacts) to the app
    this.component(GreetingComponent);

    // this line plugs in the extension
    this.add(createBindingFromClass(FrenchGreeter));

    // Add the following line
    this.configure('greeters.ChineseGreeter').to({nameFirst: false});

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
