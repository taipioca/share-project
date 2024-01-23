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

// save a new product to the database
router.post("/newproduct", auth.ensureLoggedIn, (req, res) => {
  const newProduct = new Product({
    id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    points: req.body.points || 1,
    minShareDays: req.body.minShareDays || 1,
    maxShareDays: req.body.maxShareDays || 1,
    pickupLocation: req.body.pickupLocation,
    returnLocation: req.body.returnLocation,
    pickupNotes: req.body.pickupNotes,
    returnNotes: req.body.returnNotes,
    image: req.body.image,
    sharer: {
      sharer_id: "456",
      name: "Test Sharer",
    },
  });

  newProduct.save().then((product) => res.send(product));
});

router.get("/catalog", (req, res) => {
  Product.find({}).then((items) => {
    res.send(items);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
