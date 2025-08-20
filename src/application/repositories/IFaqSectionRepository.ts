import { Prisma, FaqSection } from '../../generated/prisma';

export interface IFaqSectionRepository {
  findMany(args?: Prisma.FaqSectionFindManyArgs): Promise<FaqSection[]>;
  findUnique(args: Prisma.FaqSectionFindUniqueArgs): Promise<FaqSection | null>;
  findFirst(args?: Prisma.FaqSectionFindFirstArgs): Promise<FaqSection | null>;
  create(args: Prisma.FaqSectionCreateArgs): Promise<FaqSection>;
  update(args: Prisma.FaqSectionUpdateArgs): Promise<FaqSection>;
  updateMany(args: Prisma.FaqSectionUpdateManyArgs): Promise<Prisma.BatchPayload>;
  upsert(args: Prisma.FaqSectionUpsertArgs): Promise<FaqSection>;
  delete(args: Prisma.FaqSectionDeleteArgs): Promise<FaqSection>;
  deleteMany(args?: Prisma.FaqSectionDeleteManyArgs): Promise<Prisma.BatchPayload>;
  count(args?: Prisma.FaqSectionCountArgs): Promise<number>;
}