export async function updateValidationQueue(oldClients, setClients, updatedClientInfo) {

    const newClients = oldClients.map(val => Object.assign({}, val))


    newClients.forEach(client => {
        if (client.queue === updatedClientInfo.queue) {
            client.lab = updatedClientInfo.lab
            client.name = updatedClientInfo.name
            client.panel = updatedClientInfo.panel
            client.step = updatedClientInfo.step
            client.status = updatedClientInfo.status
            client.assigned_to = updatedClientInfo.assignedTo
        }
    })

    setClients(newClients)
}