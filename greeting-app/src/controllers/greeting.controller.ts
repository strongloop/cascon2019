import {param, get, Request, RestBindings} from '@loopback/rest';
import {Message} from '../types';
import {inject} from '@loopback/context';
import {
  GreetingService,
  GREETING_SERVICE,
} from '@loopback/example-greeter-extension';

export class GreetingController {
  

  constructor(
    @inject(GREETING_SERVICE) private greetingService: GreetingService,
  ) {}
  
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
    @param.header.string('Accept-Language') language: string,
  ): Promise<Message> {
    const greeting = await this.greetingService.greet(language, name);
    return {
      timestamp: new Date(),
      language,
      greeting,
    };
  }



}
