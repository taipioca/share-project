import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import Modal from "react-modal";
import { Product as ProductInterface } from "../../../../server/models/Product";
import { NewReview } from "../modules/NewReview";
Modal.setAppElement("#root");

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
      console.log("foundItem:", foundItem);
      setFoundItem(foundItem);
      if (foundItem && foundItem.status === "pending") {
        setApproveRequest(true);
      }
    });
  }, [itemId]);
  // console.log("itemRequests:", itemRequests);
  // console.log("foundItem:", foundItem);

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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal} className = "upload-button">
        <i className="fas fa-eye"> </i>Activity
      </button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div>
          <p style={{ fontSize: "2em", fontWeight: "bold" }}>Status</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={foundItem ? foundItem.image : ""}
              alt={foundItem ? foundItem.title : ""}
              style={{ width: "100px", height: "auto" }}
            />
            <div style={{ marginLeft: "20px" }}>
              <p> Title: {foundItem ? foundItem.title : ""}</p>
              <p> Points: {foundItem ? foundItem.points : ""}</p>
              <p> Status: {foundItem ? foundItem.status : ""}</p>
              {approveRequest ? (
                <button
                  type="submit"
                  className="NewRequestInput-button u-pointer"
                  value="Submit"
                  onClick={changeProductStatus}
                >
                  Confirm to approve the request
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <hr />
        <p style={{ fontSize: "2em", fontWeight: "bold" }}>History</p>
        {itemRequests.map((request, index) => (
          <div key={index}>
            <p>Title: {request.title}</p>
            <p>
              Requester: {request.requester ? request.requester.requester_name : "No requester"}
            </p>
            <p>Start Date: {request.start_date}</p>
            <p>End Date: {request.end_date}</p>
            <NewReview
              reviewer_name={request.sharer.sharer_name} //THERE IS A REALLY BAD NAMING ISSUE LOL SO IT'S ALL MIXED UP
              reviewer_id={request.sharer.sharer_id}
              sharer_id={request.requester.requester_id}
              sharer_name={request.requester.requester_name}
            />

            <hr></hr>
          </div>
        ))}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ItemActivityButton;
