// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/example-greeter-extension
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {bind, config} from '@loopback/context';
import {asGreeter, Greeter} from '@loopback/example-greeter-extension';

/**
 * Options for the French greeter
 */
export interface FrenchGreeterOptions {
  // Name first, default to `true`
  nameFirst: boolean;
}

/**
 * A greeter implementation for French.
 */
@bind(asGreeter)
export class FrenchGreeter implements Greeter {
  language = 'fr';

  constructor(
    /**
     * Inject the configuration for FrenchGreeter
     */
    // the decorator here allows you to configure your class
    @config()
    private options: FrenchGreeterOptions = {nameFirst: true},
  ) {}

  greet(name: string) {
    if (this.options && this.options.nameFirst === false) {
      return `Bonjour，${name}！`;
    }
    return `${name}, Bonjour`;
  }
}
