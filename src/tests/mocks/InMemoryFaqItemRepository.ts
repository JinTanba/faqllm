import { Prisma, FaqItem } from '../../generated/prisma';
import { IFaqItemRepository } from '../../application/repositories/IFaqItemRepository';

export class InMemoryFaqItemRepository implements IFaqItemRepository {
  private items: Map<string, FaqItem> = new Map();
  private idCounter = 1;

  async findMany(args?: Prisma.FaqItemFindManyArgs): Promise<FaqItem[]> {
    let result = Array.from(this.items.values());
    
    if (args?.where) {
      result = this.filterItems(result, args.where);
    }
    
    if (args?.orderBy) {
      result = this.sortItems(result, args.orderBy);
    }
    
    if (args?.skip) {
      result = result.slice(args.skip);
    }
    
    if (args?.take) {
      result = result.slice(0, args.take);
    }
    
    return result;
  }

  async findUnique(args: Prisma.FaqItemFindUniqueArgs): Promise<FaqItem | null> {
    if (args.where.id) {
      return this.items.get(args.where.id) || null;
    }
    return null;
  }

  async findFirst(args?: Prisma.FaqItemFindFirstArgs): Promise<FaqItem | null> {
    const items = await this.findMany({
      where: args?.where,
      orderBy: args?.orderBy,
      take: 1
    });
    return items[0] || null;
  }

  async create(args: Prisma.FaqItemCreateArgs): Promise<FaqItem> {
    const id = `item-${this.idCounter++}`;
    const now = new Date();
    const data = args.data as any;
    const item: FaqItem = {
      id,
      sourceId: data.sourceId || null,
      sectionId: data.sectionId || null,
      question: data.question,
      answers: Array.isArray(data.answers) ? data.answers : (data.answers?.set || []),
      metadata: data.metadata !== undefined ? data.metadata as Prisma.JsonValue : null,
      createdAt: now,
      updatedAt: now
    };
    this.items.set(id, item);
    return item;
  }

  async update(args: Prisma.FaqItemUpdateArgs): Promise<FaqItem> {
    const existing = await this.findUnique({ where: args.where });
    if (!existing) {
      throw new Error('Item not found');
    }
    
    const updated = {
      ...existing,
      ...args.data,
      updatedAt: new Date()
    };
    
    this.items.set(existing.id, updated as FaqItem);
    return updated as FaqItem;
  }

  async updateMany(args: Prisma.FaqItemUpdateManyArgs): Promise<Prisma.BatchPayload> {
    const items = await this.findMany({ where: args.where });
    items.forEach(item => {
      const updated = {
        ...item,
        ...args.data,
        updatedAt: new Date()
      };
      this.items.set(item.id, updated as FaqItem);
    });
    return { count: items.length };
  }

  async upsert(args: Prisma.FaqItemUpsertArgs): Promise<FaqItem> {
    const existing = await this.findUnique({ where: args.where });
    if (existing) {
      return this.update({
        where: args.where,
        data: args.update
      });
    } else {
      return this.create({
        data: args.create
      });
    }
  }

  async delete(args: Prisma.FaqItemDeleteArgs): Promise<FaqItem> {
    const item = await this.findUnique({ where: args.where });
    if (!item) {
      throw new Error('Item not found');
    }
    this.items.delete(item.id);
    return item;
  }

  async deleteMany(args?: Prisma.FaqItemDeleteManyArgs): Promise<Prisma.BatchPayload> {
    const items = await this.findMany({ where: args?.where });
    items.forEach(item => this.items.delete(item.id));
    return { count: items.length };
  }

  async count(args?: Prisma.FaqItemCountArgs): Promise<number> {
    const items = await this.findMany({ where: args?.where });
    return items.length;
  }

  private filterItems(items: FaqItem[], where: any): FaqItem[] {
    return items.filter(item => {
      if (where.id && item.id !== where.id) return false;
      if (where.sourceId && item.sourceId !== where.sourceId) return false;
      if (where.sectionId && item.sectionId !== where.sectionId) return false;
      if (where.question?.contains && !item.question.includes(where.question.contains)) return false;
      return true;
    });
  }

  private sortItems(items: FaqItem[], orderBy: any): FaqItem[] {
    const field = Object.keys(orderBy)[0];
    const direction = orderBy[field];
    return items.sort((a, b) => {
      const aVal = (a as any)[field];
      const bVal = (b as any)[field];
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }
}