import { AppConfig } from 'lib/types'

export const onLogoutCommand = (config: AppConfig) => {
    config.set('accessToken', null)
    console.log('Cleared Access Token on logout')
}
