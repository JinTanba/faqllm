import { Prisma, FaqSource } from '../../generated/prisma';
import { IFaqSourceRepository } from '../../application/repositories/IFaqSourceRepository';
import prisma from './prismaClient';

export class PrismaFaqSourceRepository implements IFaqSourceRepository {
  async findMany(args?: Prisma.FaqSourceFindManyArgs): Promise<FaqSource[]> {
    return prisma.faqSource.findMany(args);
  }

  async findUnique(args: Prisma.FaqSourceFindUniqueArgs): Promise<FaqSource | null> {
    return prisma.faqSource.findUnique(args);
  }

  async findFirst(args?: Prisma.FaqSourceFindFirstArgs): Promise<FaqSource | null> {
    return prisma.faqSource.findFirst(args);
  }

  async create(args: Prisma.FaqSourceCreateArgs): Promise<FaqSource> {
    return prisma.faqSource.create(args);
  }

  async update(args: Prisma.FaqSourceUpdateArgs): Promise<FaqSource> {
    return prisma.faqSource.update(args);
  }

  async updateMany(args: Prisma.FaqSourceUpdateManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqSource.updateMany(args);
  }

  async upsert(args: Prisma.FaqSourceUpsertArgs): Promise<FaqSource> {
    return prisma.faqSource.upsert(args);
  }

  async delete(args: Prisma.FaqSourceDeleteArgs): Promise<FaqSource> {
    return prisma.faqSource.delete(args);
  }

  async deleteMany(args?: Prisma.FaqSourceDeleteManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqSource.deleteMany(args);
  }

  async count(args?: Prisma.FaqSourceCountArgs): Promise<number> {
    return prisma.faqSource.count(args);
  }
}