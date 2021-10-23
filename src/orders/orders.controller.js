const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Validation

function dishesHaveQuantity(dishes, next) {
    for(let i = 0; i < dishes.length; i++) {
        const dish = dishes[i];
        if (Number.isInteger(dish.quantity) && dish.quantity > 0) {
            continue;
        } 
        return next({
            status: 400,
            message: `Dish ${i} must have a quantity that is an integer greater than 0`,
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

function hasDishes(req, res, next) {
    const { data: { dishes } = {} } = req.body;
    if (dishes) {
        if (Array.isArray(dishes) && dishes.length > 0) {
            dishesHaveQuantity(dishes, next);
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

function hasStatus(req, res, next) {
    const { data: { status } = {} } = req.body;
    if (status) {
        validateStatus(status, next);
    } else {
        next({
            status: 400,
            message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
        });
    }
}

function idMatches(req, res, next) {
    const { orderId } = req.params;
    const { data: { id } = {} } = req.body;
    if (id) {
        if (id === orderId) {
            return next();
        } else {
            return next({
                status: 400,
                message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.`
            });
        }
    }
    next();
}

function isNotDelivered(req, _, next) {
    const { data: { status } = {} } = req.body;
    if (status === "delivered") {
        return next({
            status: 400,
            message: `A delivered order cannot be changed`,
        });
    }
    next();
}

function isPending(_, res, next) {
    const status = res.locals.order.status;
    if (status === "pending") {
        return next();
    }
    next({
        status: 400,
        message: `An order cannot be deleted unless it is pending`
    });
}

function orderExists(req, res, next) {
    const { orderId } = req.params;
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) {
        res.locals.order = foundOrder;
        return next();
    }
    next({
        status: 404,
        message: `Order does not exist, id: ${orderId}`
    });
}

function validateStatus(status, next) {
    const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];
    if (validStatuses.includes(status)) {
        return next();
    } else {
        return next({
            status: 400,
            message: `Order must have a status of pending, preparing, out-for-delivery, delivered`,
        });
    }
}

// Route Handlers

function create(req, res) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    const order = {
        id: nextId(),
        deliverTo,
        mobileNumber,
        status,
        dishes,
    };
    orders.push(order);
    res.status(201).json({ data: order });
}

function destroy(req, res) {
    const { orderId } = req.params;
    const index = orders.findIndex((order) => order.id === orderId);
    orders.splice(index, 1);
    res.sendStatus(204);
}

function list(req, res) {
    res.json({ data: orders });
}

function read(req, res) {
    res.json({ data: res.locals.order });
}

function update(req, res) {
    const order = res.locals.order;
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
    order.deliverTo = deliverTo;
    order.mobileNumber = mobileNumber;
    order.status = status;
    order.dishes = dishes;
    res.json({ data: order });
}

module.exports = {
    create: [hasDeliverTo, hasMobileNumber, hasDishes, create],
    destroy: [orderExists, isPending, destroy],
    list,
    read: [orderExists, read],
    update: [orderExists, hasDeliverTo, hasDishes, hasMobileNumber, hasStatus, idMatches, isNotDelivered, update],
}