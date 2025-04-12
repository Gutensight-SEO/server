/** @format */


import gravatar from "gravatar";


const generateGravatar = (email) => {
    const avatar = gravatar.url(email, {
        protocol: 'https', 
        s: '200', // size: 200*200
        r: 'PG', // rating: PG
        d: 'identicon', // default: identicon
    });

    return avatar;
}

export default generateGravatar;