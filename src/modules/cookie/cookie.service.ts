import { Injectable } from '@nestjs/common';
import { CreateCookieDto } from './dto/create-cookie.dto';
import { UpdateCookieDto } from './dto/update-cookie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CookieEntity, CookieStatus } from './entities/cookie.entity';
import { LEVEL } from '../user/entities/user.entity';
import { FacebookService } from '../facebook/facebook.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CookieService {
  constructor(
    @InjectRepository(CookieEntity)
    private repo: Repository<CookieEntity>,
  ) { }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id
      }
    })
  }

  update(id: number, updateCookieDto: UpdateCookieDto) {
    return this.repo.save({ ...updateCookieDto, id })
  }
}
