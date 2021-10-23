const controller = require("./orders.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

// TODO: Implement the /orders routes needed to make the tests pass
router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);
router
    .route("/:orderId")
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
