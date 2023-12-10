import path from 'node:path'
import os from 'node:os'
import process from 'node:process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { DEFAULT_CONFIG } from './constants'
import { AppConfig } from './types'

const homedir = os.homedir()

const getMacosConfigPath = (name: string) => ({
    config: path.join(path.join(homedir, 'Library'), 'Preferences', name)
})

const getWindowsConfigPath = (name: string) => ({
    config: path.join(process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming'), name, 'config')
})

// https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
const getLinuxConfigPath = (name: string) => ({
    config: path.join(process.env.XDG_CONFIG_HOME || path.join(homedir, '.config'), name)
})

const getPlatformPaths = (name: string) => {
    if (process.platform === 'darwin') {
        return getMacosConfigPath(name)
    }

    if (process.platform === 'win32') {
        return getWindowsConfigPath(name)
    }

    return getLinuxConfigPath(name)
}

export const getAppConfig = () => {
    const { config } = getPlatformPaths('relay-cli')

    if (!existsSync(config)) {
        writeFileSync(config, JSON.stringify(DEFAULT_CONFIG, null, 2))
    }

    const data = readFileSync(config, { encoding: 'utf-8' })
    const json = JSON.parse(data)
    const defaultKeys = Object.keys(DEFAULT_CONFIG)

    // eslint-disable-next-line functional/no-let
    let containsNotIncludedChanges = false
    // eslint-disable-next-line no-loops/no-loops
    for (const key of Object.keys(json)) {
        if (!defaultKeys.includes(key)) {
            // eslint-disable-next-line functional/immutable-data
            delete json[key]
            containsNotIncludedChanges = true
        }
    }

    if (containsNotIncludedChanges || !defaultKeys.every(key => Object.keys(json).includes(key))) {
        const correctedConfig = { ...DEFAULT_CONFIG, ...json }
        // eslint-disable-next-line functional/immutable-data
        Object.assign(json, correctedConfig)
        writeFileSync(config, JSON.stringify(correctedConfig, null, 2))
    }

    return {
        data: json as AppConfig,
        set: <TKey extends keyof AppConfig>(key: TKey, value: AppConfig[TKey]) => {
            // eslint-disable-next-line functional/immutable-data
            const data = Object.assign(json, {
                [key]: value
            })

            writeFileSync(config, JSON.stringify(data, null, 2))
        }
    }
}
