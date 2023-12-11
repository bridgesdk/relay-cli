import { decode } from 'jsonwebtoken'

export const isAccessTokenExpired = (token: string) => {
    const decoded = decode(token, {
        json: true
    })

    if (!decoded) {
        return false
    }

    const expiry = decoded.exp

    if (!expiry) {
        return false
    }

    return expiry < Math.floor(Date.now() / 1000)
}
