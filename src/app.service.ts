import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: "UP",
      timestamp: new Date().toISOString(),
      service: "Scrum Board API",
      version: "0.0.1",
    }
  }
}
