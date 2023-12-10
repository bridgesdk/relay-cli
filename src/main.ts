#!/usr/bin/env node

import { getAppConfig } from 'lib/config'

const config = getAppConfig()

console.log('config:', config)
