/** @format */


export type CreateUserRequestType = {
    // id?: string,
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    role: string
}

export type LoginUserRequestType = {
    // id?: string,
    detail: string,
    password: string
}

export type UpdateUserRequestType = {
    firstname?: string,
    lastname?: string,
    username?: string,
    email?: string,
    password?: string,
}