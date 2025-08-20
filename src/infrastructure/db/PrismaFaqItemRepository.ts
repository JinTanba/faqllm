import { Prisma, FaqItem } from '../../generated/prisma';
import { IFaqItemRepository } from '../../application/repositories/IFaqItemRepository';
import prisma from './prismaClient';

export class PrismaFaqItemRepository implements IFaqItemRepository {
  async findMany(args?: Prisma.FaqItemFindManyArgs): Promise<FaqItem[]> {
    return prisma.faqItem.findMany(args);
  }

  async findUnique(args: Prisma.FaqItemFindUniqueArgs): Promise<FaqItem | null> {
    return prisma.faqItem.findUnique(args);
  }

  async findFirst(args?: Prisma.FaqItemFindFirstArgs): Promise<FaqItem | null> {
    return prisma.faqItem.findFirst(args);
  }

  async create(args: Prisma.FaqItemCreateArgs): Promise<FaqItem> {
    return prisma.faqItem.create(args);
  }

  async update(args: Prisma.FaqItemUpdateArgs): Promise<FaqItem> {
    return prisma.faqItem.update(args);
  }

  async updateMany(args: Prisma.FaqItemUpdateManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqItem.updateMany(args);
  }

  async upsert(args: Prisma.FaqItemUpsertArgs): Promise<FaqItem> {
    return prisma.faqItem.upsert(args);
  }

  async delete(args: Prisma.FaqItemDeleteArgs): Promise<FaqItem> {
    return prisma.faqItem.delete(args);
  }

  async deleteMany(args?: Prisma.FaqItemDeleteManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqItem.deleteMany(args);
  }

  async count(args?: Prisma.FaqItemCountArgs): Promise<number> {
    return prisma.faqItem.count(args);
  }
}