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
import UserModel from "./models/User";

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // Not logged in.
    return res.send({});
  }
  res.send(req.user);
});

// get a user from the database. Input: userid. Output: user object.
router.get("/user", (req, res) => {
  console.log("req.query.userid:", req.query.userid);
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

// update a user in the database. Input: user object. Output: updated user object.
router.post("/user", async (req, res) => {
  // console.log("req (in router.post(/user):", req);
  try {
    const userId = req.body._id;
    const updatedData = req.body;

    // Find the user and update it
    const user = await UserModel.findByIdAndUpdate(
      userId,
      updatedData,
      { new: true } // This option returns the updated document
    );

    // If no user was found, send an error
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Send the updated user
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An unknown error occurred" });
  }
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
      reviewer_id: req.body.reviewer.reviewer_id,
      reviewer_name: req.body.reviewer.reviewer_name,
    },
    sharer: {
      sharer_id: req.body.sharer.sharer_id,
      sharer_name: req.body.sharer.sharer_name,
    },
    rating: req.body.rating,
    comment: req.body.comment,
    timestamp: new Date().toISOString(),
  });
  newReview.save().then((review) => res.send(review));
});

router.get("/getreview", (req, res) => {
  Review.find({}).then((reviews) => {
    res.send(reviews);
  });
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

// change the status of a product in the database.
router.post("/changeproductstatus", async (req, res) => {
  try {
    const itemId = req.body.item_id;
    const itemStatus = req.body.item_status;

    // Validate itemStatus
    if (!["available", "pending", "unavailable"].includes(itemStatus)) {
      return res.status(400).send({ error: "Invalid item_status" });
    }

    // Find the product and update its status
    const product = await ProductModel.findOneAndUpdate(
      { id: itemId },
      { status: itemStatus },
      { new: true } // This option returns the updated document
    );

    // If no product was found, send an error
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    // Send the updated product
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An unknown error occurred" });
  }
});

// get all requests from the database.
router.get("/requests", (req, res) => {
  console.log("tried getting request");
  Request.find({}).then((items) => {
    res.send(items);
  });
});

// get a single request from the database. Input: request_id. Output: request object.
router.get("/singlerequest", async (req, res) => {
  const requestId = req.query.request_id;

  if (!requestId) {
    return res.status(400).send({ error: "request_id is required" });
  }

  try {
    const request = await RequestModel.findById(requestId);

    if (!request) {
      return res.status(404).send({ error: "Request not found" });
    }

    res.send(request);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "An unknown error occurred" });
  }
});

// declare a new type 'RequestWithImage' that allow to add image url to the request object.
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

// get all requests that is pending for approval.
router.get("/pendingproduct", async (req, res) => {
  try {
    const userId = req.query.user_id;
    const requesterItems = await RequestModel.find({
      "requester.requester_id": userId,
      status: "open",
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

// get all in-use products for a requester.
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
