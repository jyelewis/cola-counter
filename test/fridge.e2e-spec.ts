import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FridgeModule } from '../src/modules/fridge/fridge.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const fridgeName1 = `fridge-e2e-1-${Math.random().toString(36)}`;
  const fridgeName2 = `fridge-e2e-2-${Math.random().toString(36)}`;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FridgeModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/fridge/:fridgeName/...', async () => {
    // first fetch should create the fridge
    await request(app.getHttpServer())
      .get(`/fridge/${fridgeName1}`)
      .expect(200)
      .expect({
        name: fridgeName1,
        numStockedCans: 0,
      });

    // second fetch should return the existing the fridge
    await request(app.getHttpServer())
      .get(`/fridge/${fridgeName1}`)
      .expect(200)
      .expect({
        name: fridgeName1,
        numStockedCans: 0,
      });

    // no stock events yet
    await request(app.getHttpServer())
      .get(`/fridge/${fridgeName1}/stock-events`)
      .expect(200)
      .expect([]);

    // add 15 cans
    await request(app.getHttpServer())
      .post(`/fridge/${fridgeName1}/stock-events`)
      .send({ numCansAdded: 15 })
      .expect(201);

    // remove 1
    await request(app.getHttpServer())
      .post(`/fridge/${fridgeName1}/stock-events`)
      .send({ numCansAdded: -1 })
      .expect(201);

    // read stock events
    const stockEventsRes = await request(app.getHttpServer())
      .get(`/fridge/${fridgeName1}/stock-events`)
      .expect(200);

    expect(stockEventsRes.body).toEqual([
      { fridgeName: fridgeName1, numCansAdded: -1, date: expect.any(String) },
      { fridgeName: fridgeName1, numCansAdded: 15, date: expect.any(String) },
    ]);

    // read fridge
    await request(app.getHttpServer())
      .get(`/fridge/${fridgeName1}`)
      .expect(200)
      .expect({
        name: fridgeName1,
        numStockedCans: 14,
      });
  });

  it('Create new fridge with stock-event post', async () => {
    // first fetch should create the fridge
    await request(app.getHttpServer())
      .post(`/fridge/${fridgeName2}/stock-events`)
      .send({ numCansAdded: 15 })
      .expect(201);

    // read fridge
    await request(app.getHttpServer())
      .get(`/fridge/${fridgeName2}`)
      .expect(200)
      .expect({
        name: fridgeName2,
        numStockedCans: 15,
      });
  });
});
