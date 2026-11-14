// Vue CLI 3 / webpack 4 need the legacy OpenSSL provider on current Node releases.
const { spawnSync } = require('node:child_process')
const cli = require.resolve('@vue/cli-service/bin/vue-cli-service.js')
const flags = Number(process.versions.node.split('.')[0]) >= 17 ? ['--openssl-legacy-provider'] : []
const child = spawnSync(process.execPath, [...flags, cli, ...process.argv.slice(2)], { stdio: 'inherit' })
if (child.error) throw child.error
process.exit(child.status === null ? 1 : child.status)
