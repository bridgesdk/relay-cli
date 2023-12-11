import { Axios } from 'axios'
import { AppConfig } from 'lib/types'

export const onShowResources = (config: AppConfig) => {
    const { accessToken } = config.data

    if (!accessToken) {
        throw new Error('You are not logged in, please use `relay login [host]` to authorize yourself!')
    }

    const baseURL = config.data.baseHostUrl || null

    if (!baseURL) {
        throw new Error('We do not know which relay host you are trying to reach.')
    }

    const http = new Axios({
        baseURL,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformResponse: (data: any) => {
            if (typeof data === 'string') {
                return JSON.parse(data)
            }

            return data
        },
        headers: {
            Authorization: `Bearer ${config.data.accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    http.get('/resource/list')
        .then(({ data }) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const records = data.map((result: any) => ({ ...result, connected: false }))

            console.table(records)
        })
        .catch(error => {
            console.error(`Failed to reach (${baseURL}/resource/list) due to an error of:`, error)
        })
}
