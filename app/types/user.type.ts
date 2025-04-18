/** @format */


export type CreateUserRequestType = {
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    role: string
}

export type LoginUserRequestType = {
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