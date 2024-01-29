import express from "express";
import auth from "./auth";
import socketManager from "./server-socket";
import User from "./models/User";
import Product from "./models/Product";
import ProductModel from "./models/Product";
const router = express.Router();
import Review from "./models/Review";
import Request, { RequestDoc } from "./models/Request";
import RequestModel from "./models/Request";

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
      sharer_id: req.body.sharer.sharer_id,
      sharer_name: req.body.sharer.sharer_name,
    },
  });

  newProduct.save().then((product) => res.send(product));
});

// get a products from the database.
router.get("/getproduct", (req, res) => {
  // console.log("req.query.item:", req.query.item);
  // console.log("typeof req.query.item:", typeof req.query.item);
  if (typeof req.query.item === "string") {
    Product.findOne({ id: req.query.item }).then((product) => {
      res.send(product);
    });
  } else {
    console.log("req.query.item is not a string");
  }
});

// update a product in the database.
router.post("/updateproduct", auth.ensureLoggedIn, (req, res) => {
  const { id, ...updateData } = req.body;

  Product.findOneAndUpdate({ id: id }, updateData, { new: true }, (err, doc) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json(doc);
    }
  });
});

// get all products from the database.
router.get("/catalog", (req, res) => {
  Product.find({}).then((items) => {
    res.send(items);
  });
});

// Create a review for the sharer
router.post("/newreview", auth.ensureLoggedIn, (req, res) => {
  const newReview = new Review({
    reviewer: {
      reviewer_id: req.body.reviewerId,
      reviewer_name: req.body.reviewerName,
    },
    sharer: {
      sharer_id: "req.body.sharer_id",
      sharer_name: "req.body.sharer_name",
    },
    rating: req.body.rating,
    comment: req.body.content,
    timestamp: new Date().toISOString(),
  });
  newReview.save().then((review) => res.send(review));
});

// create a new request in the database.
router.post("/newrequest", auth.ensureLoggedIn, (req, res) => {
  const newRequest = new Request({
    requester: {
      requester_id: req.body.requester_id,
      requester_name: req.body.requester_name,
    },
    sharer: {
      sharer_id: req.body.sharer_id,
      sharer_name: req.body.sharer_name,
    },
    title: req.body.title,
    item_id: req.body.item_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    sharer_points: req.body.sharer_points,
    requester_points: req.body.requester_points,
  });
  newRequest.save().then((request) => res.send(request));
});

// get all requests from the database.
router.get("/requests", (req, res) => {
  console.log("tried getting request");
  Request.find({}).then((items) => {
    res.send(items);
  });
});

// get all requests that is pending for approval.
type RequestWithImage = {
  requester: {
    requester_id: string;
    requester_name: string;
  };
  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  title: string;
  item_id: string;
  _id: string;
  start_date: string;
  end_date: string;
  sharer_points: number;
  requester_points: number;
  image?: string;
};

router.get("/pendingproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const requesterItems = await RequestModel.find({
      "requester.requester_id": userId,
    });

    // console.log("requesterItems (in get(/pendingproduct):", requesterItems);
    let foundResult: RequestWithImage[] = [];
    for (let requesterItem of requesterItems) {
      const product = await ProductModel.findOne({ id: requesterItem.item_id });
      if (product && product.status === "pending") {
        const requestObject = requesterItem.toObject();
        const requestWithImage: RequestWithImage = { ...requestObject, image: product.image };
        foundResult.push(requestWithImage);
      }
    }
    res.send(foundResult);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send({ error: error.toString() });
    } else {
      res.status(500).send({ error: "An unknown error occurred" });
    }
  }
});

// get in-use products for a requester.
router.get("/inuseproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const requesterItems = await RequestModel.find({
      "requester.requester_id": userId,
    });

    let foundResult: RequestWithImage[] = [];
    for (let requesterItem of requesterItems) {
      const product = await ProductModel.findOne({ id: requesterItem.item_id });
      if (product && product.status === "unavailable") {
        const requestObject = requesterItem.toObject();
        const requestWithImage: RequestWithImage = { ...requestObject, image: product.image };
        foundResult.push(requestWithImage);
      }
    }
    res.send(foundResult);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send({ error: error.toString() });
    } else {
      res.status(500).send({ error: "An unknown error occurred" });
    }
  }
});

// get order history for a requester.
router.get("/orderhistoryproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const requestHistory = await RequestModel.find({
      $or: [{ "requester.requester_id": userId }, { "sharer.sharer_id": userId }],
    });

    let foundResult: RequestWithImage[] = [];
    for (let item of requestHistory) {
      const product = await ProductModel.findOne({ id: item.item_id, status: "available" });
      if (product) {
        const requestObject = item.toObject();
        const requestWithImage: RequestWithImage = { ...requestObject, image: product.image };
        foundResult.push(requestWithImage);
      }
    }
    res.send(foundResult);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send({ error: error.toString() });
    } else {
      res.status(500).send({ error: "An unknown error occurred" });
    }
  }
});

// get all products that is unavailable for ther sharer.
router.get("/unavailableproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const unavailableItems = await Product.find({
      "sharer.sharer_id": userId,
      status: "unavailable",
    });

    let unavailableResult: RequestWithImage[] = [];
    for (let item of unavailableItems) {
      const request = await RequestModel.findOne({ item_id: item.id });
      if (request) {
        const requestObject = request.toObject();
        const requestWithImage: RequestWithImage = { ...requestObject, image: item.image };
        unavailableResult.push(requestWithImage);
      }
    }
    res.send(unavailableResult);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send({ error: error.toString() });
    } else {
      res.status(500).send({ error: "An unknown error occurred" });
    }
  }
});

// get all requests that are ended (i.e. items are returned).
router.get("/returnedproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const returnedItems = await Product.find({
      "sharer.sharer_id": userId,
      status: "available",
    });

    let returnedItemsResult: RequestWithImage[] = [];
    for (let item of returnedItems) {
      const request = await RequestModel.findOne({ item_id: item.id });
      if (request) {
        const requestObject = request.toObject();
        const requestWithImage: RequestWithImage = { ...requestObject, image: item.image };
        returnedItemsResult.push(requestWithImage);
      }
    }
    res.send(returnedItemsResult);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).send({ error: error.toString() });
    } else {
      res.status(500).send({ error: "An unknown error occurred" });
    }
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  const msg = `Api route not found: ${req.method} ${req.url}`;
  res.status(404).send({ msg });
});
export default router;
