import {bind, config} from '@loopback/context';
import {asGreeter, Greeter} from '@loopback/example-greeter-extension';

/**
 * Options for the Frech greeter
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
    // By checking the value of property language, the extension point matches a greeter to the language set from a request.
    language = 'fr';

    constructor(
        /**
         * Inject the configuration for FrenchGreeter
         */
        // we inject the configuration we just defined here with `@config` decorator. We will talk about configuration later. 
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