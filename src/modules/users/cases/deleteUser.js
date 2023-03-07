export default async function deleteUser(user_id,
    refreshUsers
) {

    const response = await fetch('api/user', {
        method: 'DELETE',
        body: JSON.stringify({
            user_id: user_id
        })
    })

    if (response.status === 200) {
        refreshUsers()
    } else {
        alert(response.status, response.statusText)
    }
}