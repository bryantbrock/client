import React, { useEffect, useState } from "react";

export const ClientsContext = React.createContext();

export function ClientsProvider(props) {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    return cleanData();
  }, []);

  useEffect(() => {
    // Call to an endpoint to update the user session
    // everytime the client changed

    fetch("api/auth/update-user-session", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: selectedClient,
      }),
    }).catch();
  }, [selectedClient]);

  const retrieveClientsInfo = async (myClients) => {
    let clientsList = [];

    await fetch(`api/client/getUserClients`, {
      method: "POST",
      headers: {
        "Content-type": "json/application",
      },
      body: JSON.stringify({
        ids: myClients,
      }),
    })
      .then((res) => res.json())
      .then((c) => {
        clientsList = c;
      })
      .catch();
    setClients(clientsList);
  };

  const cleanData = () => {
    // We need to call it before logout

    // Remove client_id from session
    fetch("api/auth/update-user-session", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: null,
      }),
    }).catch();

    setClients([]);
    setSelectedClient(null);
  };
  return (
    <ClientsContext.Provider
      value={{
        // states
        clients,
        selectedClient,
        // functions
        retrieveClientsInfo,
        setSelectedClient,
      }}
    >
      {props.children}
    </ClientsContext.Provider>
  );
}
