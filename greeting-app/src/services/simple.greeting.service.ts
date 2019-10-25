export class SimpleGreetingService {
    
    async greet(language: string, name: string): Promise<string> {     
      return `Greeting '${name}' in language '${language}'`;
     }
  }