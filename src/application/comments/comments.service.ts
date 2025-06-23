import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { LEVEL, UserEntity } from '../user/entities/user.entity';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { CookieEntity } from '../cookie/entities/cookie.entity';
import { FacebookService } from '../facebook/facebook.service';
import { IGetCommentParams } from './comments.service.i';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class CommentsService {
  vnTimezone = 'Asia/Bangkok';
  constructor(
    @InjectRepository(CommentEntity)
    private repo: Repository<CommentEntity>,
  ) { }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id
      }
    })
  }
}
