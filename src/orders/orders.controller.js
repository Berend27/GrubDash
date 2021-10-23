const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Validation
// todo: debug this
function dishesHaveQuantity(dishes) {
    for(let dish of dishes) {
        if (Number.isInteger(dish.quantity) && dish.quantity > 0) {
            continue;
        } 
        return next({
            status: 400,
            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
        });
    }
}

function hasDeliverTo(req, res, next) {
    const { data: { deliverTo } = {} } = req.body;
    if (deliverTo) {
        return next();
    } 
    next({
        status: 400,
        message: "Order must include a deliverTo",
    });
}

function hasMobileNumber(req, res, next) {
    const { data: { mobileNumber } = {} } = req.body;
    if (mobileNumber) {
        return next();
    } 
    next({
        status: 400,
        message: "Order must include a mobileNumber",
    });
}

function hasDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (dishes) {
        if (Array.isArray(dishes) && dishes.length > 0) {
            dishesHaveQuantity(dishes);
            return next();
        } else {
            return next({
                status: 400,
                message: `Order must include at least one dish`,
            });
        }
    }
    next({
        status: 400,
        message: "Order must include a dish",
    })
}

// TODO: Implement the /orders handlers needed to make the tests pass
// Route Handlers

function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const order = {
        id: nextId,
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };
    orders.push(order);
    res.status(201).json({ data: dish });
}

function list(req, res) {
    res.json({ data: orders });
}

module.exports = {
    create: [hasDeliverTo, hasMobileNumber, hasDishes, create],
    list,
}