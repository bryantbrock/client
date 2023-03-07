export async function addToValidationQueue(oldClients, setClients, newClient, newPanel, newAssignedTo) {
    let newQueue = oldClients.length > 0 ? oldClients[oldClients.length - 1].queue + 1 : 1


    const data = {
        queue: newQueue,
        date: new Date(),
        lab: newClient,
        name: "Wiley Coyote",
        validated: "No",
        panel: newPanel,
        step: "Linearity",
        status: "Pending Review",
        assigned_to: newAssignedTo,
        notes: 0,
        actions: {
            download: true,
            analysis: true,
            upload: true,
            add_review_notes: true,
            download_final_report: true,
            update: true,
            delete: true
        }
    }

    const newClients = [...oldClients, data]
    setClients(newClients)
}