import path from 'node:path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { DEFAULT_CONFIG } from './constants'
import { DefaultConfig } from './types'
import { getPlatformPaths } from './utils'

export const getAppConfig = () => {
    const { config } = getPlatformPaths()

    if (!existsSync(config)) {
        mkdirSync(path.dirname(config), { recursive: true })
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
        data: json as DefaultConfig,
        set: <TKey extends keyof DefaultConfig>(key: TKey, value: DefaultConfig[TKey]) => {
            // eslint-disable-next-line functional/immutable-data
            const data = Object.assign(json, {
                [key]: value
            })

            writeFileSync(config, JSON.stringify(data, null, 2))
        },
        setMany: (values: { [Key in keyof DefaultConfig]?: DefaultConfig[Key] }) => {
            // eslint-disable-next-line functional/immutable-data
            const data = Object.assign(json, values)

            writeFileSync(config, JSON.stringify(data, null, 2))
        }
    }
}
