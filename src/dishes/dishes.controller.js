const nextId = require("../utils/nextId");
const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Validation

function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish) {
        res.locals.dish = foundDish;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}`
    });
}

function hasDescription(req, res, next) {
    const { data: { description } = {} } = req.body;
    if (description) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a description",
    });
}

function hasImageUrl(req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if (image_url) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a image_url"
    });
}

function hasName(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name) {
        return next();
    }
    next({
        status: 400,
        message: "Dish must include a name",
    });
}

function idMatches(req, res, next) {
    const { dishId } = req.params;
    const { data: { id } = {} } = req.body;
    if ((id && id === dishId) || !id) {
        return next();
    } else {
        return next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        });
    }
}

function priceIsPositive(req, res, next) {
    const { data: { price } = {} } = req.body;
    if (price) {
        if (Number.isInteger(price) && price > 0) {
            return next();
        } else {
            return next({
                status: 400,
                message: "Dish must have a price that is an integer greater than 0"
            });
        }
    } 
    next({
        status: 400,
        message: "Dish must include a price"
    });
}

function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const newDish = {
        id: nextId(),
        name,
        description,
        price,
        image_url,
    }
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
}

function list(req, res) {
    res.json({ data: dishes });
}

function read(req, res) {
    res.json({ data: res.locals.dish });
}

function update(req, res) {
    const dish = res.locals.dish;
    const { data: { name, description, price, image_url } = {} } = req.body;
    dish.name = name;
    dish.description = description;
    dish.price = price;
    dish.image_url = image_url;
    res.json({ data: dish });
}

module.exports = {
    create: [hasDescription, hasImageUrl, hasName, priceIsPositive, create],
    list,
    read: [dishExists, read],
    update: [dishExists, hasName, idMatches, hasDescription, hasImageUrl, priceIsPositive, update],
}