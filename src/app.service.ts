// data.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosResponse } from 'axios'; // AxiosResponse eklenmiş
import * as https from 'https'; // import şekli değiştirildi
import { Data } from './data.model'

@Injectable()
export class AppService {
  constructor(@InjectModel('Data') private readonly dataModel: Model<Data>) {}

  async getToken(): Promise<string> {
    const url = 'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions';
    const username = 'apitest';
    const password = 'test123';
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    // SSL sertifikası kontrolünü devre dışı bırak
    const agent = new https.Agent({ rejectUnauthorized: false });

    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
          },
          httpsAgent: agent, 
        },
      );

      return response.data.response.token;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error; 
    }
  }

  async fetchDataAndSyncWithDatabase(token: string): Promise<any> {
    const url = 'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1'; 
    const agent = new https.Agent({ rejectUnauthorized: false });
    const response = await axios.patch(
      url,
      {
        fieldData: {},
        script: 'getData',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        httpsAgent: agent,
      },
    );

    return response.data.response.scriptResult;
  }
}
