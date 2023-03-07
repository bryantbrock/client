export default async function createUser(userData, refreshUsers, handleClose) {
    const response = await fetch('api/user', {
        method: 'POST',
        body: JSON.stringify({
            active: userData.active,
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
            roles: userData.roles,
            clients: userData.clients,
        })
    })

    if (response.status === 200) {
        handleClose()
        refreshUsers()
    } else if (response.status === 422) {
        alert("Email exists.")
    } else {
        alert(response.status, response.body)
        
    }
}