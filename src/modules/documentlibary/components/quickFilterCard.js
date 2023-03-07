import React, { useEffect } from "react";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { Button, Typography } from "@mui/material";

const QuickFilterCard = ({ quickFilter, getQuickFiltersTags }) => {
  const { id, name, description } = quickFilter;

  const handleSelectedQuickFilter = async () => {
    // Retrieve tags from specific quickfilter
    await fetch("api/library/quickfilter/get-tags-from-quickfilter", {
      method: "POST",
      headers: {
        "Content-type": "json/application",
      },
      body: JSON.stringify({
        id,
      }),
    })
      .then((res) => res.json())
      .then((tags) => {
        getQuickFiltersTags(tags);
      })
      .catch();
  };

  return (
    <Button
      variant="contained"
      style={{
        width: 190,
        minHeight: 110,
        backgroundColor: "#d5eaec",
        paddingLeft: 10,
        marginRight: 20,
        marginTop: 15,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 15,
      }}
      onClick={handleSelectedQuickFilter}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <div>
          <ArticleOutlinedIcon style={{ color: "black" }} />
        </div>

        <div style={{ width: "100%" }}>
          <Typography
            variant="subtitle2"
            color={"black"}
            style={{
              fontWeight: "bold",
              marginLeft: 15,
            }}
          >
            {name}
          </Typography>

          <div
            style={{
              marginTop: 5,
            }}
          >
            <Typography
              variant="subtitle2"
              style={{
                whiteSpace: "pre-line",
                color: "black",
                textTransform: "none",
              }}
              align="center"
            >
              {/* {description.replace('<br />', '\n')} */}
              {description.split("<br/>").join("\n")}
            </Typography>
          </div>
        </div>
      </div>
    </Button>
  );
};

export default QuickFilterCard;
