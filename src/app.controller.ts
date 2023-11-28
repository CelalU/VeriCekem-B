import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('data')
export class AppController {
  constructor(private readonly dataService: AppService) {}

  @Get('sync')
  async syncData(): Promise<any> {
    try {
      const token = await this.dataService.getToken();
   const res = await this.dataService.fetchDataAndSyncWithDatabase(token);
 
  const  data = JSON.parse(res);
    return {data:data, status:200}}
    catch (error) {
      return {error:error, status:500}
    }
  }
}

