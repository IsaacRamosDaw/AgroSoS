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
    const response = await fetch(`http://localhost:8080/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    // console.log(" Data en createUser")
    // console.log(data)
    return data;
}

export const updateUser = async (user) => {
    console.log("user in updateUser")
    console.log(user)
    const response = await fetch(`http://localhost:8080/auth/update/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    // console.log(" Data en updateUser")
    // console.log(data)
    return data.user;
}

export const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}

export async function loginUser(email, password) {
    const response = await fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();    
    if (!data.success) { throw new Error(data.message || "Error desconocido en el servidor de login"); }

    return data;
}

export const promoteUser = async (requesterId, targetUserId) => {
    const response = await fetch(`http://localhost:8080/auth/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId, targetUserId })
    });
    const data = await response.json();
    return data;
}

export const revokeUser = async (requesterId, targetUserId) => {
    const response = await fetch(`http://localhost:8080/auth/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId, targetUserId })
    });
    const data = await response.json();
    return data;
}