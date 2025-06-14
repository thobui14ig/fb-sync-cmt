import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProxyDto } from './dto/create-proxy.dto';
import { UpdateProxyDto } from './dto/update-proxy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProxyEntity, ProxyStatus } from './entities/proxy.entity';

@Injectable()
export class ProxyService {
  constructor(
    @InjectRepository(ProxyEntity)
    private repo: Repository<ProxyEntity>,
  ) { }

  findOne(id: number) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  async getRandomProxy() {
    const proxies = await this.repo.find({
      where: {
        status: ProxyStatus.ACTIVE,
      }
    })
    const randomIndex = Math.floor(Math.random() * proxies.length);
    const randomProxy = proxies[randomIndex];

    return randomProxy
  }

  updateProxyFbBlock(proxy: ProxyEntity) {
    return this.repo.save({ ...proxy, isFbBlock: true })
  }

  updateProxyDie(proxy: ProxyEntity) {
    return this.repo.save({ ...proxy, status: ProxyStatus.IN_ACTIVE })
  }
}
