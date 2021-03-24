const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity}`
    );

    const order = await Order.insert({ quantity });

    return order;
  }
  static async update(id, { quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order id${id} updated to ${quantity}`
    );

    const order = await Order.update({quantity, id});

    return order;
  }
};
