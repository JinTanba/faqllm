import { Prisma, FaqSection } from '../../generated/prisma';
import { IFaqSectionRepository } from '../../application/repositories/IFaqSectionRepository';
import prisma from './prismaClient';

export class PrismaFaqSectionRepository implements IFaqSectionRepository {
  async findMany(args?: Prisma.FaqSectionFindManyArgs): Promise<FaqSection[]> {
    return prisma.faqSection.findMany(args);
  }

  async findUnique(args: Prisma.FaqSectionFindUniqueArgs): Promise<FaqSection | null> {
    return prisma.faqSection.findUnique(args);
  }

  async findFirst(args?: Prisma.FaqSectionFindFirstArgs): Promise<FaqSection | null> {
    return prisma.faqSection.findFirst(args);
  }

  async create(args: Prisma.FaqSectionCreateArgs): Promise<FaqSection> {
    return prisma.faqSection.create(args);
  }

  async update(args: Prisma.FaqSectionUpdateArgs): Promise<FaqSection> {
    return prisma.faqSection.update(args);
  }

  async updateMany(args: Prisma.FaqSectionUpdateManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqSection.updateMany(args);
  }

  async upsert(args: Prisma.FaqSectionUpsertArgs): Promise<FaqSection> {
    return prisma.faqSection.upsert(args);
  }

  async delete(args: Prisma.FaqSectionDeleteArgs): Promise<FaqSection> {
    return prisma.faqSection.delete(args);
  }

  async deleteMany(args?: Prisma.FaqSectionDeleteManyArgs): Promise<Prisma.BatchPayload> {
    return prisma.faqSection.deleteMany(args);
  }

  async count(args?: Prisma.FaqSectionCountArgs): Promise<number> {
    return prisma.faqSection.count(args);
  }
}