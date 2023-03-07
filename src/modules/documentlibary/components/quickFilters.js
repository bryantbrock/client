import React, { useContext, useEffect, useState } from "react";
import QuickFilterCard from "./quickFilterCard";
import { CircularProgress } from "@mui/material";
import { ClientsContext } from "../../contexts/clientsContext";

const QuickFilters = (props) => {
  const { selectedClient } = useContext(ClientsContext);

  const [loading, setLoading] = useState(true);
  const [quickFilters, setQuickFilters] = useState([]);

  // useEffect(() => {
  //     // Just retrieve when there is no client
  //     selectedClient === null && retrieveQuickFilters()
  // }, [])

  const retrieveQuickFilters = async () => {
    await fetch("/api/library/quickfilter", { method: "GET" })
      .then((res) => res.json())
      .then((quickFilters) => {
        // console.log(quickFilters)
        setQuickFilters(quickFilters);
        setLoading(false);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const retrieveClientQuickFilters = async () => {
      if (selectedClient) {
        await fetch("/api/library/quickfilter/getClientQuickfilters", {
          method: "POST",
          body: JSON.stringify({
            client_id: selectedClient.id,
          }),
        })
          .then((res) => res.json())
          .then((quickFilters) => {
            // console.log(quickFilters)
            setQuickFilters(quickFilters);
            setLoading(false);
          })
          .catch((error) => {});
      }
    };
    setLoading(true);

    selectedClient !== null && retrieveClientQuickFilters();
    selectedClient === null && retrieveQuickFilters();
  }, [selectedClient]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ marginTop: 10 }}>
      {quickFilters.length > 0 &&
        quickFilters.map((qf, index) => (
          <div key={index} style={styles.cardsContainer}>
            <QuickFilterCard
              quickFilter={qf}
              getQuickFiltersTags={props.getQuickFiltersTags}
              key={index}
            />
          </div>
        ))}
    </div>
  );
};

export default QuickFilters;

const styles = {
  cardsContainer: {
    display: "inline-block",
  },
};
