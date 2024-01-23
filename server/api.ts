import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import User from "./models/User";
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

router.post("/newreview", auth.ensureLoggedIn, (req, res) => {
  const newReview = new Review({
    reviewer: {
      reviewer_id: req.body.reviewerId,
      reviewer_name: req.body.reviewerName,
    },
    sharer: {
      sharer_id: "req.body.sharerId",
      sharer_name: "req.body.sharerName",
    },
    rating: req.body.rating,
    comment: req.body.content,
    timestamp: new Date().toISOString(),
  });
  newReview.save().then((review) => res.send(review));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});
export default router;
