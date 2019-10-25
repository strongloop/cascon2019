import {SimpleGreetingService} from '../services/simple.greeting.service';
import {param, get} from '@loopback/rest';
import {Message} from '../types';

export class GreetingController {
  private greetingService: SimpleGreetingService;

  constructor() {
    this.greetingService = new SimpleGreetingService();
  }

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
