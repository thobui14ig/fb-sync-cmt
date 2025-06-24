import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../comments/entities/comment.entity';
import { FacebookModule } from '../facebook/facebook.module';
import { LinkEntity } from '../links/entities/links.entity';
import { TokenEntity } from '../token/entities/token.entity';
import { MonitoringService } from './monitoring.service';
import { CookieEntity } from '../cookie/entities/cookie.entity';
import { ProxyEntity } from '../proxy/entities/proxy.entity';
import { DelayEntity } from '../setting/entities/delay.entity';
import { HttpModule } from '@nestjs/axios';
import { MonitoringController } from './monitoring.controller';
import { GetCommentPublicUseCaseModule } from '../facebook/usecase/get-comment-public/get-comment-public.module';
import { HideCommentUseCaseModule } from '../facebook/usecase/hide-comment/hide-comment.module';
import { GetUuidUserUseCaseModule } from '../facebook/usecase/get-uuid-user/get-uuid-user.module';
import { SettingModule } from '../setting/setting.module';

@Module({
  imports: [TypeOrmModule.forFeature([LinkEntity, CommentEntity, TokenEntity, CookieEntity, ProxyEntity, DelayEntity]), FacebookModule, HttpModule, GetCommentPublicUseCaseModule, HideCommentUseCaseModule, GetUuidUserUseCaseModule, SettingModule],
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule { }
