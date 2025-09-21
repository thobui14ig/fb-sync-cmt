
import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { isNumeric } from 'src/common/utils/check-utils';
import { DataSource, Repository } from 'typeorm';
import { CommentsService } from '../comments/comments.service';
import { CommentEntity } from '../comments/entities/comment.entity';
import { FacebookService } from '../facebook/facebook.service';
import { ICommentResponse } from '../facebook/facebook.service.i';
import { GetUuidUserUseCase } from '../facebook/usecase/get-uuid-user/get-uuid-user';
import { LinkEntity } from '../links/entities/links.entity';
import { SettingService } from '../setting/setting.service';
import { KEY_PROCESS_QUEUE } from './monitoring.service.i';

dayjs.extend(utc);

interface CmtWaitProcess {
    userUid: string,
    commentId: string,
    linkId: number
}
@Processor(KEY_PROCESS_QUEUE.ADD_COMMENT)
export class MonitoringConsumer {
    listCmtWaitProcess: CmtWaitProcess[] = []
    constructor(
        private settingService: SettingService,
        private commentService: CommentsService,
        private readonly facebookService: FacebookService,
        private getUuidUserUseCase: GetUuidUserUseCase,
        @InjectRepository(CommentEntity)
        private commentRepository: Repository<CommentEntity>,
        @InjectRepository(LinkEntity)
        private linkRepository: Repository<LinkEntity>,
        private readonly httpService: HttpService,
        private readonly conection: DataSource,

    ) {
    }
    @Process({
        name: 'transcode',
        concurrency: 10
    })
    async process(job: Job<{ resComment: ICommentResponse, link: LinkEntity }>): Promise<any> {
        const { link, resComment } = job.data
        return this.run(link, resComment)
    }

    async run(link, resComment) {
        try {
            const {
                commentId,
                commentMessage,
                phoneNumber,
                userIdComment,
                userNameComment,
                commentCreatedAt,
            } = resComment || {}
            if (!resComment?.commentId || !resComment?.userIdComment) return

            let isSave = await this.checkIsSave(commentMessage)
            if (isSave) {
                const comment = await this.commentService.getComment(link.id, link.userId, commentId)
                if (!comment) {
                    const uid = (isNumeric(userIdComment) ? userIdComment : (await this.getUuidUserUseCase.getUuidUser(userIdComment)) || userIdComment)
                    let newPhoneNumber = null
                    if (link.user?.accountFbUuid == "chuongk57@gmail.com") {
                        newPhoneNumber = await this.handlePhoneNumber(phoneNumber, uid, commentId, "Beewisaka@gmail.com")// mặc định sẽ call qua Beewisaka@gmail.com
                    } else {
                        await this.insertCmtWaitProcessPhone(uid, commentId, link.id)
                    }

                    if (!newPhoneNumber && link.user?.accountFbUuid == "chuongk57@gmail.com") {
                        await this.insertCmtWaitProcessPhone(uid, commentId, link.id, 'vip')
                    }

                    const commentEntity: Partial<CommentEntity> = {
                        cmtId: commentId,
                        linkId: link.id,
                        postId: link.postId,
                        userId: link.userId,
                        uid,
                        message: commentMessage,
                        phoneNumber: newPhoneNumber,
                        name: userNameComment,
                        timeCreated: commentCreatedAt as any,
                    }
                    const time = !link.lastCommentTime as any || dayjs(commentCreatedAt).isAfter(dayjs(link.lastCommentTime)) as any ? commentCreatedAt : link.lastCommentTime as any
                    const linkEntity: Partial<LinkEntity> = { id: link.id, lastCommentTime: time, timeCrawUpdate: time }
                    await Promise.all([this.commentRepository.save(commentEntity), this.linkRepository.save(linkEntity)])
                }
            }
        } catch (error) {
            console.log(error?.message)
        }
    }

    async checkIsSave(commentMessage: string) {
        let isSave = true;

        const keywords = await this.settingService.getKeywordsAdmin()
        for (const keyword of keywords) {
            if (commentMessage.includes(keyword.keyword)) {
                isSave = false;
                break;
            }
        }

        return isSave
    }

    async handlePhoneNumber(phoneNumber: string, uid: string, commentId: string, accountFbUuid: string) {
        let newPhoneNumber = phoneNumber
        if (newPhoneNumber) {
            try {
                this.facebookService.addPhone(uid, newPhoneNumber)
            } catch (error) { }
        } else {
            try {
                newPhoneNumber = await this.facebookService.getPhoneNumber(uid, commentId, accountFbUuid)
            } catch (error) {
                console.log("uid:", uid, "commentId", commentId, error.message)
            }
        }
        console.log("resssssssss:", "uid:", uid, "commentId", commentId, "newPhoneNumber: ", newPhoneNumber)
        return newPhoneNumber
    }

    insertCmtWaitProcessPhone(user_uid: string, comment_id: string, link_id: number, type = "popular") {
        try {
            return this.conection.query(`
                INSERT INTO cmt_wait_process (user_uid, comment_id, link_id, type)
                VALUES 
                ('${user_uid}', '${comment_id}', ${link_id}, '${type}')    
            `)

        } catch (error) { }
    }
}
