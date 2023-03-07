import { MenuItem, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { ClientsContext } from '../../contexts/clientsContext'

const ClientData = () => {
    const { clients, selectedClient, setSelectedClient } = useContext(ClientsContext)

    const [clientsList, setClientsList] = useState([{ id: "Select", name: "Select" }, ...clients])
    const [client, setClient] = useState(selectedClient === null ? 'Select' : selectedClient.id)

    useEffect(() => {
        setClientsList([{ id: "Select", name: "Select" }, ...clients])
    }, [clients])

    const handleSelectedClient = (e) => {
        setClient(e.target.value)
        clientsList.forEach(c => {
            if (c.id === e.target.value) {
                c.id === "Select" && setSelectedClient(null)
                c.id !== "Select" && setSelectedClient(c)
                return
            }
        })
    }
    return (
        <TextField
            // error={roleError}
            id="outlined-select-role"
            required
            // fullWidth
            style={{ width: 400 }}
            select
            label="Client Name"
            value={client}
            onChange={handleSelectedClient}
        >
            {clientsList.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                    {client.name}
                </MenuItem>
            ))}
        </TextField>
    )
}

export default ClientData