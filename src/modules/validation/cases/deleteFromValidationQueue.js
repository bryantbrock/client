
export async function deleteFromValidationQueue(queueNumber, clients, setClients) {

    const newClientsArr = clients.filter(client => client.queue != queueNumber);

    setClients(newClientsArr)
}