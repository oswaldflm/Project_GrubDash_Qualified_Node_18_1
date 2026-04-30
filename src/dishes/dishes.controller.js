const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");


// Validation functions for check dish data and params
function validateDishData(data) {
  const { name, description, image_url, price } = data;

  if (!name || name.length === 0) return "name is empty"
  if (!description || description.length === 0) return "description is missing";
  if (!image_url || image_url.length === 0) return "image_url is missing";
  if (!price || price <= 0) return "price is missing";
  if (price === undefined || price === null) return "price is missing";
  if (!Number.isInteger(price) || price <= 0) return "price must be an integer greater than 0";
  return null;
}

function validateDishParams(request, response, next) {
  error = validateDishData(request.body.data);
  if (error) {
    next({
      status: 400,
      message: error,
    });
  } else {
    next();
  }
}


function dishExists(request, response, next) {
  const { dishId } = request.params;
  const foundDish = dishes.find((dish) => dish.id === dishId);
  if (foundDish) {
    response.locals.dish = foundDish;
    next();
  } else {
    next({
      status: 404,
      message: `Dish does not exist: ${dishId}`,
    });
  }
}

function idMatches(request, response, next) {
  const { dishId } = request.params;
  const { data: { id } = {} } = request.body;
  if (id && id !== dishId) {
    next({
      status: 400,
      message: `Dish id does not match: ${id}`,
    });
  }
  next();
}

// End of Validation functions for check dish data and params

function list(request, response) {
  response.json({ data: dishes });
}

function create(request, response) {
  const { data: { name, description, image_url, price } = {} } = request.body;
  const newDish = { id: nextId(), name, description, image_url, price };
  dishes.push(newDish);
  response.status(201).json({ data: newDish });
}

function read(request, response) {
  response.json({ data: response.locals.dish });
}

function update(request, response) {
  const newDish = response.locals.dish;
  const { data: { name, description, image_url, price } = {} } = request.body;
  newDish.name = name;
  newDish.description = description;
  newDish.image_url = image_url;
  newDish.price = price;
  response.json({ data: newDish });
}

module.exports = {
  list,
  create: [validateDishParams, create],
  read: [dishExists, read],
  update: [dishExists, idMatches, validateDishParams, update],
}

// qualified-attach --token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYXR0YWNoIiwiY2FuZGlkYXRlX2lkIjoiNjlhZjdhYTg5MDI4M2QwMDEwODgwZGM1IiwiYXNzZXNzbWVudF9yZXN1bHRfaWQiOiI2OWYwMTNkMjhjNjBlMzAwMjBlMTI0NDEiLCJjaGFsbGVuZ2VfaWQiOiI2NWRjYzAzMjNlYzE0MzAwMjY4MjVjM2MifQ.ESLatj5Hm0gmOL6bUnZPxME4TTEnJM6K1KUCFuvqu40