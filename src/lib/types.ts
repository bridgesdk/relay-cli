import { getAppConfig } from './config'
import { DEFAULT_CONFIG } from './constants'

export type DefaultConfig = typeof DEFAULT_CONFIG
export type AppConfig = ReturnType<typeof getAppConfig>
