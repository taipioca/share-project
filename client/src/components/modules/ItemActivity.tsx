import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Modal from "react-modal";
import { Product as ProductInterface } from "../../../../server/models/Product";
import { NewReview } from "../modules/NewReview";
import { format } from "date-fns";

Modal.setAppElement("#root");
import "./ItemActivity.css";
type Item = {
  id: string;
  image: string;
  title: string;
  points: number;
  requester: {
    requester_id: string;
    requester_name: string;
  };

  sharer: {
    sharer_id: string;
    sharer_name: string;
  };
  start_date: string;
  end_date: string;
  item_id: string;
};

type Props = {
  itemId: string;
};

const ItemActivityButton = (props: Props) => {
  // console.log("props(inside itemActivitiyButton):", props);
  const { itemId } = props;
  const [itemRequests, setItemRequests] = useState<Item[]>([]);
  const [foundItem, setFoundItem] = useState<ProductInterface | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [approveRequest, setApproveRequest] = useState(false);

  useEffect(() => {
    get("/api/requests").then((requests: Item[]) => {
      const requestsForItem = requests.filter((request) => {
        return request.item_id === itemId;
      });
      setItemRequests(requestsForItem);
      
    });
    get("/api/catalog").then((itemsObjs: any) => {
      const foundItem =
        (itemsObjs as ProductInterface[]).find((item: ProductInterface) => item.id === itemId) ||
        null;
      setFoundItem(foundItem);
      if (foundItem && foundItem.status === "pending") {
        setApproveRequest(true);
      }
    });
  }, [itemId]);

  const changeProductStatus = async () => {
    if (!foundItem) {
      console.error("foundItem is null");
      return;
    }
    try {
      const response = await post("/api/changeproductstatus", {
        item_id: foundItem.id,
        item_status: "unavailable",
      }).then((updatedItem) => {
        setFoundItem(updatedItem);
        setApproveRequest(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updatePoints = () => {
    if (!foundItem) {
      console.error("foundItem is null");
      return;
    }
    try {
      if (foundItem) {
        if (foundItem.request_id !== undefined) {
          get("/api/singlerequest", { request_id: foundItem.request_id }).then((requestObj) => {
            const earnedPoints = requestObj.sharer_points;
            const earnedRewards = requestObj.requester_points;

            // add earned points to sharer
            get(`/api/user`, { userid: foundItem?.sharer?.sharer_id }).then((userObj) => {
              // console.log("userObj:", userObj);
              const updatedObj = userObj;
              updatedObj.points += earnedPoints;
              post("/api/user", updatedObj);
              // post("/api/user", updatedObj).then((returnedUserObj) =>
              //   console.log("returnedUserObj:", returnedUserObj)
              // );
            });

            // deduct sharer's earned points from requester and add reward points to requester
            get(`/api/user`, { userid: requestObj.requester.requester_id }).then(
              (requesterUserObj) => {
                // console.log("userObj:", userObj);
                const updatedObj = requesterUserObj;
                updatedObj.points -= earnedPoints;
                updatedObj.points += earnedRewards;
                post("/api/user", updatedObj);
                // post("/api/user", updatedObj).then((returnedUserObj) =>
                //   console.log("returnedUserObj:", returnedUserObj)
                // );
              }
            );
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleApprovalButtonClick = () => {
    changeProductStatus();
    updatePoints();
  };

  return (
    <div>
      <button onClick={openModal} className="upload-button">
        <i className="fas fa-eye"> </i>Activity
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="review-modal"
        style={{
          overlay: {
            backgroundColor: "transparent",
          },
        }}
      >
        <div className="review-modal-content">
          <span className="close" onClick={() => setModalIsOpen(false)}>
            &times;
          </span>
          <div>
            <p className="activity-status-header">Status</p>
            <div className="activity-flex-center">
              <img
                className="activity-item-image"
                src={foundItem ? foundItem.image : ""}
                alt={foundItem ? foundItem.title : ""}
              />
              <div className="activity-margin-left">
                <p className="activity-item-title">{foundItem ? foundItem.title : ""}</p>
                <p className = "activity-points">{foundItem ? foundItem.points : ""} points/day</p>
                <p className = "activity-status">Status: {foundItem ? foundItem.status : ""}</p>                {approveRequest ? (
                  <button
                    type="submit"
                    className="activity-approve-button u-pointer"
                    value="Submit"
                    onClick={handleApprovalButtonClick}
                  >
                    Approve current request
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <hr className="activity-divide-line" />
          <p className="activity-history-header">History</p>
          {itemRequests.map((request, index) => (
            <div key={index}>
              <p>
                Used by <span style={{ color: "var(--primary)" }}>{request.requester ? request.requester.requester_name : "No requester"}</span>

                {" "}from{" "}
                  <span className="orders-item-date">
                    {format(new Date(request.start_date), "MMMM d, yyyy")}
                  </span>{" "}
                  to{" "}
                  <span className="orders-item-date">
                    {format(new Date(request.end_date), "MMMM d, yyyy")}
                  </span>
                </p>
              <NewReview
                reviewer_name={request.sharer.sharer_name} //THERE IS A REALLY BAD NAMING ISSUE LOL SO IT'S ALL MIXED UP
                reviewer_id={request.sharer.sharer_id}
                sharer_id={request.requester.requester_id}
                sharer_name={request.requester.requester_name}
              />

              <hr className="activity-divide-line" />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ItemActivityButton;
