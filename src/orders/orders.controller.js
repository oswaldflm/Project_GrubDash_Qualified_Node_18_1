const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

//Create a const for the statuses of the order get it the data thru the orders-data.js file and test
const VALID_STATUSES = ["pending", "preparing", "out-for-delivery", "delivered"];
function validateDishData(dish, index) {
  const { quantity } = dish;
  if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
    return ` ${index} quantity is missing`;
  }
  return null;
}


function validateOrderData(data) {
  const { deliverTo, mobileNumber, status, dishes } = data;
  if (!deliverTo || deliverTo.length === 0) return "deliverTo is missing";
  if (!mobileNumber || mobileNumber.length === 0) return "mobileNumber is missing";
  //Todo: Validate status has to be validated in the tests, error in  the structure of data, status is included in dishes, bad structure of data
  //if (!status || status.length === 0) return "status is missing";
  if (!dishes || dishes.length === 0 || !Array.isArray(dishes)) return "dishes is missing";
  for (let index = 0; index < dishes.length; index++) {
    const error = validateDishData(dishes[index], index);
    if (error) return error;
  }
  return null;
}

function validateOrderParams(request, response, next) {
  const error = validateOrderData(request.body.data);
  if (error) {
    next({
      status: 400,
      message: error,
    });
  } else {
    next();
  }
}


function orderExists(request, response, next) {
  const { orderId } = request.params;
  const order = orders.find(order => order.id === orderId);
  if (order) {
    response.locals.order = order;
    next();
  } else {
    next({ status: 404, message: `Order id not found: ${orderId}` });
  }
}

function idMatches(request, response, next) {
  const { orderId } = request.params;
  const { data: { id } = {} } = request.body;
  if (id && id !== orderId) {
    next({ status: 400, message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.` });
  } else {
    next();
  }
}

function validateStatus(request, response, next) {
  const { data: { status } = {} } = request.body;
  if (status && status.length === 0 || !VALID_STATUSES.includes(status)) {
    next({ status: 400, message: "Order must have a status of pending, preparing, out-for-delivery, delivered", });
  } else {
    next();
  }
}

function list(request, response) {
  response.json({ data: orders });
}

function create(request, response) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = request.body;
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  response.status(201).json({ data: newOrder });
}


function read(request, response) {
  response.json({ data: response.locals.order });
}

function update(request, response) {
  const order = response.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = request.body;
  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;
  response.status(200).json({ data: order });
}

function destroy(request, response, next) {
  const { orderId } = request.params;
  const order = response.locals.order;
  if (order.status !== "pending") {
    return next({ status: 400, message: `pending` });
  }
  const index = orders.findIndex(order => order.id === orderId);
  orders.splice(index, 1);
  response.sendStatus(204);
}

module.exports = {
  list,
  create: [validateOrderParams, create],
  read: [orderExists, read],
  update: [orderExists, idMatches, validateOrderParams, validateStatus, update],
  delete: [orderExists, destroy]
}

// TODO: Implement the /orders handlers needed to make the tests pass
