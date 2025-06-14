declare module 'passport-custom' {
  import { Strategy as PassportStrategy } from 'passport';
  
  export class Strategy extends PassportStrategy {
    constructor(verify: (req: any, done: (error: Error | null, user?: any) => void) => void);
    name: string;
    authenticate(req: any): void;
  }
}
