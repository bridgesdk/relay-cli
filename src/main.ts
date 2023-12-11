#!/usr/bin/env node

import { Command } from 'commander'
import { getAppConfig } from 'lib/config'
import { isAccessTokenExpired } from 'lib/utils'
import { onLoginCommand, onLogoutCommand, onShowResources } from './commands'

const config = getAppConfig()
const program = new Command()

if (config.data.accessToken && isAccessTokenExpired(config.data.accessToken)) {
    config.set('accessToken', null)
}

program
    /**
     * We are literally preventing just here formatting.
     */
    .name('relay')
    .description('Connect with audit to services through https stream and bridged relay')
    .version('1.0.0')

program
    .command('login')
    .description('Fetches your authorized access token based on github session')
    .argument('[host]', 'Optional `host` argument for saving the current relay host')
    .action(host => onLoginCommand(config, host))

program
    .command('logout')
    .description('Cleares current access token')
    .action(() => onLogoutCommand(config))

program
    .command('list')
    .description('List all available resources')
    .action(() => onShowResources(config))

program
    .command('connect <name>')
    .description('Connect to a resource if not already connected')
    .action((name: string) => {
        console.log('connecting to:', name)
    })

program.parse()
