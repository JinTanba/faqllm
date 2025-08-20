import { Prisma, FaqSource } from '../../generated/prisma';

export interface IFaqSourceRepository {
  findMany(args?: Prisma.FaqSourceFindManyArgs): Promise<FaqSource[]>;
  findUnique(args: Prisma.FaqSourceFindUniqueArgs): Promise<FaqSource | null>;
  findFirst(args?: Prisma.FaqSourceFindFirstArgs): Promise<FaqSource | null>;
  create(args: Prisma.FaqSourceCreateArgs): Promise<FaqSource>;
  update(args: Prisma.FaqSourceUpdateArgs): Promise<FaqSource>;
  updateMany(args: Prisma.FaqSourceUpdateManyArgs): Promise<Prisma.BatchPayload>;
  upsert(args: Prisma.FaqSourceUpsertArgs): Promise<FaqSource>;
  delete(args: Prisma.FaqSourceDeleteArgs): Promise<FaqSource>;
  deleteMany(args?: Prisma.FaqSourceDeleteManyArgs): Promise<Prisma.BatchPayload>;
  count(args?: Prisma.FaqSourceCountArgs): Promise<number>;
}