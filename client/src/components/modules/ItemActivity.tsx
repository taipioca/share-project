import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Modal from "react-modal";
import { Product as ProductInterface } from "../../../../server/models/Product";

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
    });
  }, [itemId]);
  // console.log("itemRequests:", itemRequests);
  // console.log("foundItem:", foundItem);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div >
      <button onClick={openModal}><i className="fas fa-eye"></i>  Activity</button>
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
            <hr></hr>
          </div>
        ))}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ItemActivityButton;
