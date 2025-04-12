const api = 'http://localhost:5000/api/v1';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQwOTAxOTQ2fQ.r7TglHFQJLGwtsttmZBfuzd0VU1xKoyrbQ85MXeGwic';
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQyODg5MTQ2fQ.uBy1p7yRJmEUjzheyZb7o6og3ul0HINc20clk19k8O8';


const getUser = async (profileId) => {
    try {
        const response = await fetch(
            `${api}/user/${profileId}`,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            }
        );

        const data = await response.json();
        console.log("User:", data);

        return await data;
    } catch (error) {
        console.log("Get User error:", error);
    }
} 
// const profileId = '67add09f753edf1fb2bfeaec';
// getUser(profileId);


const getUsers = async () => {
    try {
        const response = await fetch(
            `${api}/user/all`,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            }
        )

        const data = await response.json();
        console.log(await data);

        return await data;
    } catch (error) {
        console.log("GET USERS:", error);
    }
}
// getUsers();


const updateUser = async (profileId, firstname, lastname, username, email, role) => {
    try {
        const response = await fetch(
            `${api}/user/${profileId}`,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({firstname, lastname, username, email, role})
            }
        )

        const data = await response.json();
        console.log("UPDATE USER:", await data);

        return await data;
    } catch (error) {
        console.log("UPDATE USER ERR:", error)
    }
}
// const profileId = '67add09f753edf1fb2bfeaec'
// // const profileId = '67add3e4f8fab4845f2b6507'
// const firstname = 'ABDULHAKEEM';
// const lastname = 'MUHAMMED';
// const username = 'ennas';
// const email = 'ennas.de@gmail.com';
// const role = 'admin'

// updateUser(profileId, firstname, lastname, username, email, role)


const deleteUser = async (profileId) => {
    try {
        const response = await fetch(
            `${api}/user/${profileId}`,
            {
                method: "DELETE",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }
        )

        const data = await response.json();
        console.log(await data);

        return await data;
    } catch (error) {
        console.log("DELETE USER:", error)
    }
}
// const profileId = '67add09f753edf1fb2bfeaec';
// deleteUser(profileId);
