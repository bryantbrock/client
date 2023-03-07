export default async function updateUser(updatedUser, refreshUsers, handleClose) {

    const response = await fetch('api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            id: updatedUser.id,
            active: updatedUser.active,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            password: updatedUser.password,
            roles: updatedUser.roles,
            clients: updatedUser.clients,
        })
    })

    if (response.status === 200) {
        refreshUsers()
        handleClose()
    } else {
        alert(response.status, response.statusText)
    }
}