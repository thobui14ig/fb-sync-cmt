import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { TokenEntity, TokenHandle, TokenStatus } from './entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private repo: Repository<TokenEntity>,
  ) { }

  async getTokenCrawCmtActiveFromDb(): Promise<TokenEntity> {
    const tokens = await this.repo.find({
      where: {
        status: In([TokenStatus.ACTIVE]),
        tokenValueV1: Not(IsNull()),
        type: TokenHandle.CRAWL_CMT
      }
    })

    const randomIndex = Math.floor(Math.random() * tokens.length);
    const randomToken = tokens[randomIndex];

    return randomToken
  }

  async getTokenGetInfoActiveFromDb(): Promise<TokenEntity> {
    const tokens = await this.repo.find({
      where: {
        status: In([TokenStatus.ACTIVE, TokenStatus.LIMIT]),
        tokenValueV1: Not(IsNull()),
        type: TokenHandle.GET_INFO
      }
    })

    const randomIndex = Math.floor(Math.random() * tokens.length);
    const randomToken = tokens[randomIndex];

    return randomToken
  }

  updateStatusToken(token: TokenEntity, status: TokenStatus) {
    // console.log("🚀 ~ updateTokenDie ~ token:", token)
    return this.repo.save({ ...token, status })
  }
}
