import { Chip } from "@mui/material";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { chipStyles } from "@/styles/chips";
import AddTagModal from "./modals/addTagModal";
import { ClientsContext } from "../../contexts/clientsContext";

const TagFilters = forwardRef((props, ref) => {
  // props:
  //      isFilter
  //      isClearable
  //      ref
  //      assignedTags        --> previous assigned tags

  const { selectedClient } = useContext(ClientsContext);

  const [tagsList, setTagsList] = useState([]);

  const [addTagFilterModal, setAddTagFilterModal] = useState(false);

  useEffect(() => {
    // When a quick filter is selected
    // Or when editing a document, to set previous tags
    props.assignedTags.length > 0 && setTagsList(props.assignedTags);
  }, [props.assignedTags]);

  useEffect(() => {
    // When the selected client is changed, remove tags
    !props.assignedTags && setTagsList([]);
  }, [props.assignedTags, selectedClient]);

  useEffect(() => {
    // When tagsList change
    // callback to send tags to parent component
    props.getTags && props.getTags();
  }, [props, tagsList]);

  const handleDelete = (tag) => {
    let filteredArray = tagsList.filter(function (obj) {
      return obj.id !== tag.id;
    });

    setTagsList(filteredArray);
  };

  // To send to parent component the tags list
  useImperativeHandle(ref, () => ({
    getTagList() {
      return tagsList;
    },
  }));

  return (
    <div
      style={{
        marginTop: 10,
        marginBottom: 10,
        display: "flex",
      }}
    >
      <div
        style={{
          width: "80%",
        }}
      >
        {tagsList.length > 0 &&
          tagsList.map((tag) => (
            <Chip
              label={tag.name}
              onDelete={() => handleDelete(tag)}
              key={tag.id}
              style={chipStyles.unselectedChip}
            />
          ))}
      </div>

      <div
        style={{ width: "20%", display: "flex", justifyContent: "flex-end" }}
      >
        <Chip
          label={props.isFilter ? "Add Tag Filter" : "Add Tag"}
          variant="outlined"
          style={{
            marginRight: 5,
          }}
          onClick={() => setAddTagFilterModal(true)}
        />
        {props.isClearable && (
          <Chip
            label="Clear Filters"
            variant="outlined"
            style={{
              marginRight: 5,
            }}
            onClick={() => setTagsList([])}
          />
        )}
      </div>

      {addTagFilterModal && (
        <AddTagModal
          closeModal={() => setAddTagFilterModal(false)}
          setTags={(tags) => setTagsList([...tagsList, ...tags])}
        />
      )}
    </div>
  );
});

export default TagFilters;
