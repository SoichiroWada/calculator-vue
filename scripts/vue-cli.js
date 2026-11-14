// Vue CLI 3 / webpack 4 need the legacy OpenSSL provider on current Node releases.
const { spawn } = require('node:child_process')
const cli = require.resolve('@vue/cli-service/bin/vue-cli-service.js')
const flags = Number(process.versions.node.split('.')[0]) >= 17 ? ['--openssl-legacy-provider'] : []
// Keep the parent event loop responsive while the CLI runs, including in CI.
const child = spawn(process.execPath, [...flags, cli, ...process.argv.slice(2)], { stdio: 'inherit' })
child.on('error', error => {
  process.stderr.write(error.message + '\n')
  process.exitCode = 1
})
child.on('close', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exitCode = code === null ? 1 : code
})
