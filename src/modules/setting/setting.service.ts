import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateKeywordDto } from './dto/create-keyword.dto';
import { KeywordEntity } from './entities/keyword';
import { CreateDelayDTO } from './dto/create-delay.dto';
import { DelayEntity } from './entities/delay.entity';

@Injectable()
export class SettingService {
  constructor(
    @InjectRepository(KeywordEntity)
    private keywordRepository: Repository<KeywordEntity>,
    @InjectRepository(DelayEntity)
    private delayRepository: Repository<DelayEntity>,
  ) { }
  getKeywords(userId: number) {
    return this.keywordRepository.find({
      where: {
        userId
      }
    })
  }

  async getDelay() {
    const response = await this.delayRepository.find()
    return (response.length === 0 ? null : response[0])
  }

  removeAllKeyword() {
    return this.keywordRepository.delete({})
  }
}
