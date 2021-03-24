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
  beforeEach( async() => {
    order = await Order.insert({quantity:10})
  });

  it('creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    expect(res.body).toEqual({
      id: '2',
      quantity: 10,
    });
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
});
