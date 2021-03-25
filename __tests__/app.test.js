const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  let order;
  let order2;
  beforeEach(async () => {
    order = await Order.insert({ quantity: 10 });
    order2 = await Order.insert({ quantity: 15 });
  });

  it('creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    expect(res.body).toEqual({
      id: '3',
      quantity: 10,
    });
  });

  it('returns all orders from database', async () => {
    const res = await request(app).get('/api/v1/orders');
    expect(res.body).toEqual([
      {
        id: '1',
        quantity: 10,
      },
      {
        id: '2',
        quantity: 15,
      },
    ]);
  });

  it('updates an existing order in our database and sends a text message', async () => {
    const res = await request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 20 });

    expect(res.body).toEqual({
      id: '1',
      quantity: 20,
    });
  });

  it('returns an orders from database by id', async () => {
    const res = await request(app).get('/api/v1/orders/2');
    expect(res.body).toEqual([
      {
        id: '2',
        quantity: 15,
      },
    ]);
  });

  it('deletes an orders from database by id', async () => {
    const deleteRes = await request(app).delete('/api/v1/orders/2');
    const res = await request(app).get('/api/v1/orders');
    expect(res.body.find((item) => item === deleteRes.body[0])).toEqual(undefined);
  });
});
