import os from 'node:os'
import path from 'node:path'
import { decode } from 'jsonwebtoken'
import { APP_NAME } from './constants'
import { Paths } from './types'

const homedir = os.homedir()

const getMacosPaths = () => ({
    config: path.join(path.join(homedir, 'Library'), 'Preferences', APP_NAME),
    socket: path.join(path.join(homedir, 'Library'), 'Preferences', APP_NAME)
})

const getWindowsPaths = () => ({
    config: path.join(process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming'), APP_NAME, 'config'),
    socket: path.join(process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming'), APP_NAME, 'socket')
})

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const getLinuxPaths = () => ({
    config: path.join(process.env.XDG_CONFIG_HOME || path.join(homedir, '.config'), APP_NAME),
    socket: path.join(process.env.XDG_CONFIG_HOME || path.join(homedir, '.config'), `${APP_NAME}.socket`)
})

export const getPlatformPaths = (): Paths => {
    if (process.platform === 'darwin') {
        return getMacosPaths()
    }

    if (process.platform === 'win32') {
        return getWindowsPaths()
    }

    return getLinuxPaths()
}

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
