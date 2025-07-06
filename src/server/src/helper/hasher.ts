import bcrypt from "bcrypt";

export const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hash(password, salt)
}

export const checkHash = (password: string, hash: string) => {
    return bcrypt.compareSync(password, hash)
}