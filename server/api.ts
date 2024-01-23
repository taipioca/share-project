import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import User from "./models/User";
import Product from "./models/Product";
const router = express.Router();
import Review from "./models/Review";
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});
router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
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

// save a new product to the database.
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

router.post("/newreview", auth.ensureLoggedIn, (req, res) => {
  const newReview = new Review({
    reviewer: {
      reviewer_id: "test reviewer id",
      reviewer_name: "test reviewer name",
    },
    sharer: {
      sharer_id: "test sharer id",
      sharer_name: "test sharer name",
    },
    rating: "4.6",
    comment: "wauwwwww",
    timestamp: "2021-09-14T14:48:00.000Z",
  });
  newReview.save().then((review) => res.send(review));
});
// router.post("/review", auth.ensureLoggedIn, (req, res)) => {
//   const review = new Review({
//     user: req.user,
//     text: req.body.text,
//     rating: req.body.rating,
//   });
//   review.save().then((review) => {
//     res.send(review);
//   });
// };
// }
// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});
export default router;
