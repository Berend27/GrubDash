const controller = require("./dishes.controller");
const router = require("express").Router();

// TODO: Implement the /dishes routes needed to make the tests pass
router
    .route("/")
    .get(controller.list);
router
    .route("/:dishId")
    .get(controller.read);

module.exports = router;
