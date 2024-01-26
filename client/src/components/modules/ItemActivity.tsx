import React, { useState, useEffect } from "react";
import { get } from "../../utilities";
import Modal from "react-modal";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    get("/api/requests").then((requests: Item[]) => {
      const requestsForItem = requests.filter((request) => {
        return request.item_id === itemId;
      });
      setItemRequests(requestsForItem);
    });
  }, [itemId]);
console.log(itemRequests);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>View Requests</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        {itemRequests.map((request, index) => (
          <div key={index}>
            <p>{request.title}</p>
            <p>{request.requester ? request.requester.requester_name : 'No requester'}</p>
            <p>{request.start_date}</p>
            <p>{request.end_date}</p>
            <hr></hr>
          </div>
        ))}
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default ItemActivityButton;
