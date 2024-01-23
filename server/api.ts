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
      reviewer_id: "test reviewer id",
      reviewer_name: "test reviewer name",
    },
    sharer: {
      sharer_id: "test sharer id",
      sharer_name: "test sharer name",
    },
    rating: "4.6",
    comment: req.body.content,
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
