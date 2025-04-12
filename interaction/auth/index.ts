
//


// const api = "http://localhost:5000/api/v1";
// const api = "http://localhost:5020/api/v1";
const api = "http://localhost:5000/api/v1";
// const api = "http://localhost/api/v1";
// const token = "";


//  register 
const register = async ({ firstname, lastname, username, email, password, confirmPassword }) => {
    try {
        // console.log("Registering User...")
        const response = await fetch(
            `${api}/auth/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstname, lastname, username, email, password, confirmPassword })
            }
        )
        // console.log("registration response:", response)
        
        const json = await response.json();
        console.log("Registration JSON:", json);

        return await json;
    } catch (error) {
        console.log("registration error:", error)
    }
}
const firstname = "ennas";
const lastname = "Muhademmed";
const username = "ennas";
const email = "ennas.de@gmail.com";
const password = "Admin123";
const confirmPassword = "Admin123";


register({ firstname, lastname, username, email, password, confirmPassword })

// registration response: Response {
//     status: 202,
//     statusText: 'Accepted',
//     headers: Headers {
//       vary: 'Origin',
//       'access-control-allow-credentials': 'true',
//       'content-security-policy': "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
//       'cross-origin-opener-policy': 'same-origin',
//       'cross-origin-resource-policy': 'same-origin',
//       'origin-agent-cluster': '?1',
//       'referrer-policy': 'no-referrer',
//       'strict-transport-security': 'max-age=31536000; includeSubDomains',
//       'x-content-type-options': 'nosniff',
//       'x-dns-prefetch-control': 'off',
//       'x-download-options': 'noopen',
//       'x-frame-options': 'SAMEORIGIN',
//       'x-permitted-cross-domain-policies': 'none',
//       'x-xss-protection': '0',
//       'content-type': 'application/json; charset=utf-8',
//       'content-length': '169',
//       etag: 'W/"a9-7CPUVUy74WJYX60MF2NHJEsuGPI"',
//       date: 'Wed, 19 Mar 2025 01:16:23 GMT',
//       connection: 'keep-alive',
//       'keep-alive': 'timeout=5'
//     },
//     body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
//     bodyUsed: false,
//     ok: true,
//     redirected: false,
//     type: 'basic',
//     url: 'http://localhost:5000/v1/auth/register'
//   }
//   Registration JSON: {
//     message: 'Registration in progress',
//     correlationId: '430e3e85-2cc3-4e89-85cd-ef38fb6587df',
//     statusUrl: '/api/v1/streaming/status/430e3e85-2cc3-4e89-85cd-ef38fb6587df'
//   }



// // TEN MILLION REQUESTS:

// const oneMillionRequests = async (numOfReqs) => {
//     const currentDate = new Date();
//     const startTime = currentDate.getSeconds();
//     console.log("Start seconds:", startTime);
//     for (let i = 0; i < numOfReqs; i++) {
//         const firstname = `Abd${i}`;
//         const lastname = `Muh${i}`;
//         const username = `enn${i}`;
//         const email = `enn.d${i}@gmail.com`;
//         const password = `Admin123${i}`;
//         const confirmPassword = `Admin123${i}`;
//         register({ firstname, lastname, username, email, password, confirmPassword })
//     }
// }

// // const numOfReqs = 10000000;
// // const numOfReqs = 1000000;
// // const numOfReqs = 100000;
// // const numOfReqs = 100000;
// const numOfReqs = 10000;
// // const numOfReqs = 1000;
// oneMillionRequests(numOfReqs);

// const checkStatus = async (correlationId) => {
//     try {
//         const response = await fetch(
//             `${api}/streaming/status/${correlationId}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             }
//         )
//         console.log("checkStatus response:", await response)
        
//         const json = await response.json();
//         console.log("checkStatus JSON:", json);

//         return await json;
//     } catch (error) {
//         console.log("checkStatus error:", error)
//     }
// }
// console.log(checkStatus("430e3e85-2cc3-4e89-85cd-ef38fb6587df"))

//  login 
const login = async ({ detail, password }) => {
    try {
        const response = await fetch(
            `${api}/auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ detail, password })
            }
        )
        
        const json = await response.json();
        console.log("Login JSON:", json);

        return await json;
    } catch (error) {
        console.log("Login error:", error)
    }
}
// // const detail = "ennas3";
// const detail = "ennas.de3@gmail.com"
// const password = "Admin123";
// login({ detail, password })
// Login JSON: {
//     success: true,
//     message: 'Login Successful',
//     data: {
//       accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQwOTAxOTQ2fQ.r7TglHFQJLGwtsttmZBfuzd0VU1xKoyrbQ85MXeGwic',
//       user: {
//         _id: '67bad2506ec5c20b46a8e660',
//         firstname: 'Abdulhakeem',
//         lastname: 'Muhammed',
//         username: 'ennas3',
//         email: 'ennas.de3@gmail.com',
//         role: 'user',
//         createdAt: '2025-02-23T07:46:24.314Z',      
//         updatedAt: '2025-02-23T07:52:26.257Z',      
//         refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmFkMjUwNmVjNWMyMGI0NmE4ZTY2MCIsImlhdCI6MTc0MDI5NzE0NiwiZXhwIjoxNzQyODg5MTQ2fQ.uBy1p7yRJmEUjzheyZb7o6og3ul0HINc20clk19k8O8'       
//       }
//     }
// }