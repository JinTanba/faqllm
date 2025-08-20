import { PrismaFaqItemRepository } from './PrismaFaqItemRepository';
import { InMemoryFaqItemRepository } from '../../tests/mocks/InMemoryFaqItemRepository';
import { IFaqItemRepository } from '../../application/repositories/IFaqItemRepository';

describe('PrismaFaqItemRepository', () => {
  let repository: IFaqItemRepository;

  beforeEach(() => {
    repository = new InMemoryFaqItemRepository();
  });

  describe('CRUD operations', () => {
    it('should create a new FAQ item', async () => {
      const created = await repository.create({
        data: {
          question: 'What is Node.js?',
          answers: ['Node.js is a JavaScript runtime'],
          sourceId: 'source-1',
          sectionId: 'section-1',
          metadata: { category: 'backend' }
        }
      });

      expect(created.id).toBeDefined();
      expect(created.question).toBe('What is Node.js?');
      expect(created.answers).toEqual(['Node.js is a JavaScript runtime']);
    });

    it('should find items by sourceId', async () => {
      await repository.create({
        data: {
          question: 'Question 1',
          answers: ['Answer 1'],
          sourceId: 'source-1'
        }
      });

      await repository.create({
        data: {
          question: 'Question 2',
          answers: ['Answer 2'],
          sourceId: 'source-1'
        }
      });

      await repository.create({
        data: {
          question: 'Question 3',
          answers: ['Answer 3'],
          sourceId: 'source-2'
        }
      });

      const items = await repository.findMany({
        where: { sourceId: 'source-1' }
      });

      expect(items).toHaveLength(2);
      expect(items.every(item => item.sourceId === 'source-1')).toBe(true);
    });

    it('should update an item', async () => {
      const created = await repository.create({
        data: {
          question: 'Original question',
          answers: ['Original answer']
        }
      });

      const updated = await repository.update({
        where: { id: created.id },
        data: { question: 'Updated question' }
      });

      expect(updated.id).toBe(created.id);
      expect(updated.question).toBe('Updated question');
    });

    it('should upsert an item', async () => {
      const upserted1 = await repository.upsert({
        where: { id: 'non-existent' },
        create: {
          question: 'New question',
          answers: ['New answer']
        },
        update: {
          question: 'Updated question'
        }
      });

      expect(upserted1.question).toBe('New question');

      const upserted2 = await repository.upsert({
        where: { id: upserted1.id },
        create: {
          question: 'Another new question',
          answers: ['Another answer']
        },
        update: {
          question: 'Updated question'
        }
      });

      expect(upserted2.id).toBe(upserted1.id);
      expect(upserted2.question).toBe('Updated question');
    });

    it('should delete an item', async () => {
      const created = await repository.create({
        data: {
          question: 'To be deleted',
          answers: ['Will be removed']
        }
      });

      const deleted = await repository.delete({
        where: { id: created.id }
      });

      expect(deleted.id).toBe(created.id);

      const found = await repository.findUnique({
        where: { id: created.id }
      });

      expect(found).toBeNull();
    });

    it('should support pagination', async () => {
      for (let i = 1; i <= 10; i++) {
        await repository.create({
          data: {
            question: `Question ${i}`,
            answers: [`Answer ${i}`]
          }
        });
      }

      const page1 = await repository.findMany({
        skip: 0,
        take: 3
      });

      const page2 = await repository.findMany({
        skip: 3,
        take: 3
      });

      expect(page1).toHaveLength(3);
      expect(page2).toHaveLength(3);
      expect(page1[0].id).not.toBe(page2[0].id);
    });

    it('should count items', async () => {
      await repository.create({
        data: {
          question: 'Q1',
          answers: ['A1'],
          sourceId: 'source-1'
        }
      });

      await repository.create({
        data: {
          question: 'Q2',
          answers: ['A2'],
          sourceId: 'source-1'
        }
      });

      await repository.create({
        data: {
          question: 'Q3',
          answers: ['A3'],
          sourceId: 'source-2'
        }
      });

      const totalCount = await repository.count();
      const source1Count = await repository.count({
        where: { sourceId: 'source-1' }
      });

      expect(totalCount).toBe(3);
      expect(source1Count).toBe(2);
    });
  });
});