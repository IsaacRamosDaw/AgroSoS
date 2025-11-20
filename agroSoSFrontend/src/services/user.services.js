export const getAllUsers = async () => {
    const response = await fetch(`http://localhost:8080/api/allUser`);
    const data = await response.json();
    return data;
}

export const getUserById = async (id) => {
    const response = await fetch(`http://localhost:8080/api/user/${id}`);
    const data = await response.json();
    return data;
}

export const createUser = async (user) => {
    const response = await fetch(`http://localhost:8080/api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
}

export const updateUser = async (user) => {
    const response = await fetch(`http://localhost:8080/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    return data;
}

export const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}
