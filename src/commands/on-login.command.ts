import express from 'express'
import { AppConfig } from 'lib/types'

export const onLoginCommand = (config: AppConfig, host?: string) => {
    const baseURL = host || config.data.baseHostUrl || null

    if (!baseURL) {
        throw new Error('host argument on login is required but missing')
    }

    if (!config.data.baseHostUrl) {
        config.set('baseHostUrl', baseURL)
    }

    console.log('Setting up callback server')

    const app = express().get('/callback', (request, response) => {
        config.set('accessToken', request.query.accessToken as string)

        response.end('You can now close this tab')
        listener.close()

        console.log('Authorization completed')
        process.exit(0)
    })

    const listener = app.listen(0, 'localhost', () => {
        const address = listener.address()

        if (!address || typeof address === 'string') {
            throw new Error('Failed to bind a listener')
        }

        const authGithubURL = `${baseURL}/auth?callbackURL=http://localhost:${address.port}/callback`

        console.log('Follow Authorization URL for completing authorization:', authGithubURL)
    })
}
