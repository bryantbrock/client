import React, { useCallback, useEffect, useState } from "react";
import SimpleCard from "./simpleCard";
import NoDescriptionCard from "./noDescriptionCard";
import DragNDropCard from "./dragNDropCard";
import UploadFileModal from "./modals/uploadFileModal";

const CardsDashboard = (props) => {
  const { cards } = props;
  const [file, setFile] = useState(null);
  const [uploadFileModal, setUploadFileModal] = useState(false);

  const openUploadFileModal = useCallback(
    (file) => {
      setUploadFileModal(true);
      setFile(file);
    },
    [setUploadFileModal, setFile]
  );

  return (
    <div
      style={{
        textAlign: "center",
        justifyContent: "revert-layer",
      }}
    >
      {cards.map((item, index) => (
        <div
          style={{
            display: "inline-block",
          }}
          key={index}
        >
          {item.module === "simple_card" && (
            <SimpleCard {...item} key={index} />
          )}
          {item.module === "no_description_card" && (
            <NoDescriptionCard {...item} key={index} />
          )}
          {item.module === "drag_n_drop_card" && (
            <DragNDropCard
              {...item}
              key={index}
              openUploadFileModal={openUploadFileModal}
            />
          )}
        </div>
      ))}

      {uploadFileModal && (
        <UploadFileModal
          closeModal={() => setUploadFileModal(false)}
          uploadFile={file}
        />
      )}
    </div>
  );
};

export default CardsDashboard;
