module.exports = {
  extensions: { js: true, ts: 'module' },
  nodeArguments: ['--loader=ts-node/esm', '--no-warnings'],
  ignoredByWatcher: ['{coverage,dist}/**'],
  files: ['src/**/*.test.ts'],
}
