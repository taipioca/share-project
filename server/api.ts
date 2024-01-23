import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
// const User = require("./models/user");
const router = express.Router();
const Review = require("./models/review");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});

// router.get("/user", (req, res) => {
//   User.findById(req.query.userid).then((user) => {
//     res.send(user);
//   });
// });

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

// router.get("/reviews", (req, res) => {
//   Review.find({sharer: req.query.sharer}).then((reviews) => res.send(reviews));
// });

router.post("/newreview", auth.ensureLoggedIn, (req, res) => {
  const newReview = new Review({
    reviewer: {
      reviewer_id: "123",
      reviewer_name: "ABC",
    },
    // reviewer: {
    //   reviewer_id: req.user?._id ?? "",
    //   reviewer_name: req.user?.name ?? "",
    // },
    sharer: {
      sharer_id: "456",
      sharer_name: "DEF",
    },
    // sharer: {
    //   sharer_id: req.body.sharerId,
    //   sharer_name: req.body.sharerName,
    // },
    rating: "4.6",
    comment: "wauwwwww",
    timestamp: "2021-09-14T14:48:00.000Z",
  });
  newReview.save().then((review) => res.send(review));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});

export default router;
