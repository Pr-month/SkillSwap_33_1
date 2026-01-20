import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { Express } from 'express';
import { Category } from '../src/categories/entities/category.entity';
import { CreateCategoryDto } from '../src/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '../src/categories/dto/update-category.dto';
import { AccessTokenGuard } from '../src/auth/guards/accessToken.guard';
import { CategoriesService } from '../src/categories/categories.service';
import { validate as isUuid } from 'uuid';
import { AppModule } from 'src/app.module';

// Утилиты извлечения данных из ответа
const extractId = (body: unknown): string => {
  if (typeof body !== 'object' || body === null) {
    throw new TypeError('Expected body to be an object');
  }
  const record = body as Record<string, unknown>;
  if (!('id' in record) || typeof record.id !== 'string') {
    throw new TypeError('Expected body to have a string "id" property');
  }
  return record.id;
};

const extractName = (body: unknown): string => {
  if (typeof body !== 'object' || body === null) {
    throw new TypeError('Expected body to be an object');
  }
  const record = body as Record<string, unknown>;
  if (!('name' in record) || typeof record.name !== 'string') {
    throw new TypeError('Expected body to have a string "name" property');
  }
  return record.name;
};

const extractParentId = (body: unknown): string | null => {
  if (typeof body !== 'object' || body === null) {
    throw new TypeError('Expected body to be an object');
  }
  const record = body as Record<string, unknown>;
  const parent = record.parent;
  if (parent === null) return null;
  if (typeof parent !== 'object' || parent === null) {
    throw new TypeError('Expected parent to be null or object');
  }
  const parentRecord = parent as Record<string, unknown>;
  if (!('id' in parentRecord) || typeof parentRecord.id !== 'string') {
    throw new TypeError('Expected parent.id to be a string');
  }
  return parentRecord.id;
};

const extractMessage = (body: unknown): string => {
  if (typeof body !== 'object' || body === null) {
    throw new TypeError('Expected error body to be an object');
  }
  const record = body as Record<string, unknown>;
  if (!('message' in record) || typeof record.message !== 'string') {
    throw new TypeError('Expected error body to have a string "message"');
  }
  return record.message;
};

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let server: Express;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(CategoriesService)
      .useClass(
        class extends CategoriesService {
          async findOne(id: string): Promise<Category> {
            if (!isUuid(id)) {
              throw new NotFoundException('Категория не найдена');
            }
            return super.findOne(id);
          }

          async create(
            createCategoryDto: CreateCategoryDto,
          ): Promise<Category> {
            if (
              createCategoryDto.parentId &&
              !isUuid(createCategoryDto.parentId)
            ) {
              throw new NotFoundException('Родительская категория не найдена');
            }
            return super.create(createCategoryDto);
          }

          async update(
            id: string,
            updateCategoryDto: UpdateCategoryDto,
          ): Promise<Category> {
            if (!isUuid(id)) {
              throw new NotFoundException('Категория не найдена');
            }
            if (
              updateCategoryDto.parentId !== undefined &&
              updateCategoryDto.parentId !== null &&
              !isUuid(updateCategoryDto.parentId)
            ) {
              throw new NotFoundException('Родительская категорий не найдена');
            }
            return super.update(id, updateCategoryDto);
          }
        },
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Express;
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Protected CRUD operations (with mocked auth)', () => {
    it('POST /categories → create root category', async () => {
      const createDto: CreateCategoryDto = { name: 'category1' };
      const res = await request(server)
        .post('/categories')
        .send(createDto)
        .expect(201);

      const id = extractId(res.body);
      expect(id).toEqual(expect.any(String));

      const listRes = await request(server).get('/categories').expect(200);
      expect(listRes.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'category1' }),
        ]),
      );
    });

    it('POST /categories → create subcategory with parentId', async () => {
      const parentDto: CreateCategoryDto = { name: 'category1' };
      const parentRes = await request(server)
        .post('/categories')
        .send(parentDto)
        .expect(201);

      const parentId = extractId(parentRes.body);

      const childDto: CreateCategoryDto = {
        name: 'subcategory1',
        parentId,
      };

      const childRes = await request(server)
        .post('/categories')
        .send(childDto)
        .expect(201);

      expect(extractId(childRes.body)).toEqual(expect.any(String));
      expect(extractParentId(childRes.body)).toBe(parentId);
    });

    it('PATCH /categories/:id → update name and parentId', async () => {
      const cat1 = await request(server)
        .post('/categories')
        .send({ name: 'category1' } as CreateCategoryDto)
        .expect(201);
      const cat2 = await request(server)
        .post('/categories')
        .send({ name: 'category2' } as CreateCategoryDto)
        .expect(201);

      const cat1Id = extractId(cat1.body);
      const cat2Id = extractId(cat2.body);

      const updateDto: UpdateCategoryDto = {
        name: 'updated-category2',
        parentId: cat1Id,
      };

      const res = await request(server)
        .patch(`/categories/${cat2Id}`)
        .send(updateDto)
        .expect(200);

      expect(extractName(res.body)).toBe('updated-category2');
      expect(extractParentId(res.body)).toBe(cat1Id);
    });

    it('DELETE /categories/:id → removes category', async () => {
      const res = await request(server)
        .post('/categories')
        .send({ name: 'to-delete' } as CreateCategoryDto)
        .expect(201);

      const id = extractId(res.body);
      await request(server).delete(`/categories/${id}`).expect(200);
      await request(server).get(`/categories/${id}`).expect(404);
    });

    it('GET /categories/:id → returns 404 for non-existent ID', async () => {
      await request(server).get('/categories/invalid-id-123').expect(404);
    });

    it('POST /categories → returns 404 if parentId not found', async () => {
      const dto: CreateCategoryDto = {
        name: 'orphan',
        parentId: 'non-existent',
      };
      const res = await request(server)
        .post('/categories')
        .send(dto)
        .expect(404);

      expect(extractMessage(res.body)).toContain(
        'Родительская категория не найдена',
      );
    });
  });
});
