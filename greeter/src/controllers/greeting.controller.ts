import { param, get, Request, RestBindings } from "@loopback/rest";
import { Message } from "../types";
import { inject } from '@loopback/context';
// Import from the beginning but bind a simple function as service
import {
  GreetingService,
  GREETING_SERVICE,
} from '@loopback/example-greeter-extension';

// // Will be replaced by the greeting service from extension later
// export class SimpleGreetingService extends GreetingService{
//   async greet(language: string, name: string): Promise<string> {
//     return `${name} in language ${language}`;
//   }
// }

export class GreetingController {
  constructor(
    @inject(GREETING_SERVICE) private greetingService: GreetingService,
    @inject(RestBindings.Http.REQUEST) private request: Request,
  ) { }

  @get('/greet/{name}', {
    responses: {
      '200': {
        description: '',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                timestamp: 'string',
                language: 'string',
                message: 'string',
              },
            },
          },
        },
      },
    },
  })
  async greet(
    @param.path.string('name') name: string,
    @param.header.string('Accept-Language') lan: string,
  ): Promise<Message> {

    const language: string = lan;
    const greeting = await this.greetingService.greet(language, name);

    return {
      timestamp: new Date(),
      language,
      greeting,
    };
  }
}
