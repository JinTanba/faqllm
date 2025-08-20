import { Prisma, FaqItem } from '../../generated/prisma';

export interface IFaqItemRepository {
  findMany(args?: Prisma.FaqItemFindManyArgs): Promise<FaqItem[]>;
  findUnique(args: Prisma.FaqItemFindUniqueArgs): Promise<FaqItem | null>;
  findFirst(args?: Prisma.FaqItemFindFirstArgs): Promise<FaqItem | null>;
  create(args: Prisma.FaqItemCreateArgs): Promise<FaqItem>;
  update(args: Prisma.FaqItemUpdateArgs): Promise<FaqItem>;
  updateMany(args: Prisma.FaqItemUpdateManyArgs): Promise<Prisma.BatchPayload>;
  upsert(args: Prisma.FaqItemUpsertArgs): Promise<FaqItem>;
  delete(args: Prisma.FaqItemDeleteArgs): Promise<FaqItem>;
  deleteMany(args?: Prisma.FaqItemDeleteManyArgs): Promise<Prisma.BatchPayload>;
  count(args?: Prisma.FaqItemCountArgs): Promise<number>;
}