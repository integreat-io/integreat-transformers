module.exports = {
  extensions: { js: true, ts: 'module' },
  nodeArguments: ['--loader=ts-node/esm', '--no-warnings'],
  ignoredByWatcher: ['{coverage,dist}/**', '*.md'],
  files: ['src/**/*.test.ts'],
}
