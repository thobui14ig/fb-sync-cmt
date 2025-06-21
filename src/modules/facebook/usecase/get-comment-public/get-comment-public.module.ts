import { HttpModule } from "@nestjs/axios";
import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "src/common/infra/redis/redis.module";
import { CommentEntity } from "src/modules/comments/entities/comment.entity";
import { LinkEntity } from "src/modules/links/entities/links.entity";
import { LinkModule } from "src/modules/links/links.module";
import { ProxyModule } from "src/modules/proxy/proxy.module";
import { TokenModule } from "src/modules/token/token.module";
import { GetCommentPublicUseCase } from "./get-comment-public";
import { GetInfoLinkUseCaseModule } from "../get-info-link/get-info-link-usecase.module";

@Module({
    imports: [HttpModule, forwardRef(() => TokenModule), ProxyModule, TypeOrmModule.forFeature([LinkEntity, CommentEntity]), RedisModule, forwardRef(() => LinkModule), GetInfoLinkUseCaseModule],
    controllers: [],
    providers: [GetCommentPublicUseCase],
    exports: [GetCommentPublicUseCase],
})
export class GetCommentPublicUseCaseModule { }
