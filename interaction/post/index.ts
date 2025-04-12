const api = 'http://localhost:5000/api/v1';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQwOTAxOTQ2fQ.r7TglHFQJLGwtsttmZBfuzd0VU1xKoyrbQ85MXeGwic';
const refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQyODg5MTQ2fQ.uBy1p7yRJmEUjzheyZb7o6og3ul0HINc20clk19k8O8';


const getPost = async (postId) => {
    try {
        const response = await fetch(
            `${api}/post/${postId}`,
            {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }
        )

        const data = await response.json();
        console.log("GET POST:", {data});

        return await data;
    } catch (error) {
        console.log("GET POST ERROR:", {error})
    }
}
// const postId = '67bad50a4fbf65fdab5f62cc';
// getPost(postId);

const getPosts = async () => {
    try {
        const response = await fetch(
            `${api}/post`,
            {
                method: "GET",
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            }
        )

        const data = await response.json();
        console.log("GET POSTS:", data)

        return data;
    } catch (error) {
        console.log("GET POSTS:", error)
    }
}
getPosts();

const createPost = async (title, body) => {
    try {
        const response = await fetch(
            `${api}/post`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, body })
            }
        )

        const data = response.json();
        console.log("CREATE POST:", await data);

        return await data;
    } catch (error) {
        console.log("CREATE POST ERROR:", {error})
    }
}
// const title = "First Post";
// const body = "First Post Body";
// // const profileId = '';
// createPost(title, body);
// CREATE POST: {
//     success: true,
//     message: 'Posts Created',
//     data: {
//       user: '67bad2506ec5c20b46a8e660',
//       title: 'First Post',
//       body: 'First Post Body',
//       comments: [],
//       _id: '67bad50d4fbf65fdab5f62d2',
//       createdAt: '2025-02-23T07:58:05.657Z',        
//       updatedAt: '2025-02-23T07:58:05.657Z',        
//       __v: 0
//     }
// }

const updatePost = async (postId, title, body) => {
    try {
        const response = await fetch(
            `${api}/post/${postId}`,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, body })
            }
        )

        const data = response.json();
        console.log("UPDATE POST:", await data);

        return await data;
    } catch (error) {
        console.log("UPDATE POST:", error)
    }
}
// // const postId = '67bad50d4fbf65fdab5f62d2';
// // const postId = '67bad50a4fbf65fdab5f62cc';
// const postId = '67bad50b4fbf65fdab5f62cf';
// const title = "THIRD post original";
// const body = "THIRD post body original";
// updatePost(postId, title, body);

const deletePost = async (postId) => {
    try {
        const response = await fetch(
            `${api}/post/${postId}`,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }
        )

        const data = await response.json();
        console.log("DELETE POST:", {data});

        return await data;
    } catch (error) {
        console.log("DELETE POST ERROR:", {error})
    }
}
// const postId = '67badfad46c725fa3dd0dc72';
// deletePost(postId);

const deletePosts = async () => {
    try {
        const response = await fetch(
            `${api}/post`,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
            }
        )

        const data = await response.json();
        console.log("DELETE POSTS:", {data});

        return await data;
    } catch (error) {
        console.log("DELETE POSTS ERROR:", {error})
    }
}
// deletePosts();