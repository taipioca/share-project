import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import Product from "./models/Product";
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) {
    const socket = socketManager.getSocketFromSocketID(req.body.socketid);
    if (socket !== undefined) socketManager.addUser(req.user, socket);
  }
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// anything else falls to this "not found" case
router.post("/producttest", auth.ensureLoggedIn, (req, res) => {
  const newProduct = new Product({
    item_id: "123",
    item_title: "Test Product",
    item_description: "This is a test product",
    points: 100,
    min_share_day: 1,
    max_share_day: 10,
    pickup_location: "Test Location",
    return_location: "Test Return Location",
    pickup_note: "Pickup at 9AM",
    return_note: "Return before 5PM",
    product_image: "https://example.com/test-product.jpg",
    sharer: {
      sharer_id: "456",
      name: "Test Sharer",
    },
  });

  newProduct.save().then((product) => res.send(product));
});

router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
