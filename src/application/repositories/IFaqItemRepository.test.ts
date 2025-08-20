import { IFaqItemRepository } from './IFaqItemRepository';
import { FaqItem } from '@prisma/client';

describe('IFaqItemRepository', () => {
  let repository: IFaqItemRepository;
  let mockFaqItem: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>;

  beforeEach(() => {
    mockFaqItem = {
      sourceId: 'source-1',
      sectionId: 'section-1',
      question: 'What is TypeScript?',
      answers: ['TypeScript is a typed superset of JavaScript'],
      metadata: { category: 'programming' }
    };
  });

  describe('findMany', () => {
    it('should find items with Prisma-like where clause', async () => {
      const items = await repository.findMany({
        where: {
          sourceId: 'source-1'
        }
      });
      expect(Array.isArray(items)).toBe(true);
    });

    it('should support ordering', async () => {
      const items = await repository.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      expect(Array.isArray(items)).toBe(true);
    });

    it('should support pagination', async () => {
      const items = await repository.findMany({
        skip: 10,
        take: 5
      });
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeLessThanOrEqual(5);
    });

    it('should support include relations', async () => {
      const items = await repository.findMany({
        include: {
          source: true,
          section: true
        }
      });
      expect(Array.isArray(items)).toBe(true);
    });
  });

  describe('findUnique', () => {
    it('should find item by id', async () => {
      const item = await repository.findUnique({
        where: { id: 'item-1' }
      });
      expect(item).toBeNull();
    });
  });

  describe('findFirst', () => {
    it('should find first matching item', async () => {
      const item = await repository.findFirst({
        where: {
          question: {
            contains: 'TypeScript'
          }
        }
      });
      expect(item).toBeDefined();
    });
  });

  describe('create', () => {
    it('should create a new FAQ item', async () => {
      const created = await repository.create({
        data: mockFaqItem
      });
      expect(created.id).toBeDefined();
      expect(created.question).toBe(mockFaqItem.question);
    });
  });

  describe('update', () => {
    it('should update an existing FAQ item', async () => {
      const updated = await repository.update({
        where: { id: 'item-1' },
        data: { question: 'Updated question' }
      });
      expect(updated.question).toBe('Updated question');
    });
  });

  describe('upsert', () => {
    it('should create or update FAQ item', async () => {
      const result = await repository.upsert({
        where: { id: 'item-1' },
        create: mockFaqItem,
        update: { question: 'Updated question' }
      });
      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete FAQ item', async () => {
      const deleted = await repository.delete({
        where: { id: 'item-1' }
      });
      expect(deleted.id).toBe('item-1');
    });
  });

  describe('deleteMany', () => {
    it('should delete multiple FAQ items', async () => {
      const result = await repository.deleteMany({
        where: { sourceId: 'source-1' }
      });
      expect(result.count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('count', () => {
    it('should count FAQ items', async () => {
      const count = await repository.count({
        where: { sourceId: 'source-1' }
      });
      expect(typeof count).toBe('number');
    });
  });
});