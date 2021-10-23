const controller = require("./orders.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);
router
    .route("/:orderId")
    .delete(controller.destroy)
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;
