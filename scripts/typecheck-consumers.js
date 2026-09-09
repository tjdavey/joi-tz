#!/usr/bin/env node
//
// Verifies that the *published* package can be imported by TypeScript
// consumers. The package is packed with `npm pack` and extracted into a
// throwaway node_modules, so the tests exercise the real tarball contents and
// the real `main`/`types`/`exports` resolution — not the source tree.
//
const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const repoRoot = path.join(__dirname, '..')
const fixtures = path.join(repoRoot, 'test', 'types')

const TSCONFIGS = [
  'tsconfig.node10.json',
  'tsconfig.node16-cjs.json',
  'tsconfig.node16-esm.json',
  'tsconfig.bundler.json'
]

// Files that consumers must find in the tarball for typed imports to work.
const REQUIRED_FILES = ['package/lib/index.js', 'package/lib/index.d.ts']

// joi only began shipping its own declarations in this version.
const MINIMUM_TYPED_JOI = '17.2.0'

function run (cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: 'pipe', ...opts })
}

function pack (destination) {
  const output = run('npm', ['pack', '--silent', '--pack-destination', destination], { cwd: repoRoot })
  const tarball = output.trim().split('\n').pop()
  return path.join(destination, tarball)
}

function stage (tarball, workspace) {
  const modules = path.join(workspace, 'node_modules')
  fs.mkdirSync(modules, { recursive: true })
  run('tar', ['-xzf', tarball, '-C', modules])
  fs.renameSync(path.join(modules, 'package'), path.join(modules, 'joi-tz'))

  // Runtime, peer and dev dependencies come from the repo's own install so the
  // check stays offline and pinned to the versions CI already resolved.
  const { dependencies } = require(path.join(repoRoot, 'package.json'))
  for (const dependency of [...Object.keys(dependencies), 'joi', 'typescript', '@types']) {
    fs.symlinkSync(path.join(repoRoot, 'node_modules', dependency), path.join(modules, dependency))
  }

  fs.cpSync(fixtures, workspace, { recursive: true })
}

function assertTarballContents (tarball) {
  const listing = run('tar', ['-tzf', tarball]).split('\n')
  const missing = REQUIRED_FILES.filter((file) => !listing.includes(file))
  if (missing.length > 0) {
    throw new Error(`published tarball is missing ${missing.join(', ')}`)
  }
}

function typecheck (workspace, tsconfig) {
  const tsc = path.join(workspace, 'node_modules', 'typescript', 'bin', 'tsc')
  run(process.execPath, [tsc, '--project', tsconfig], { cwd: workspace })
}

function smokeTest (workspace) {
  const cjs = [
    "const Joi = require('joi').extend(require('joi-tz'))",
    "if (Joi.timezone().validate('Blah').error === undefined) throw new Error('cjs: expected a validation error')"
  ].join('\n')
  const esm = [
    "import BaseJoi from 'joi'",
    "import JoiTimezone from 'joi-tz'",
    'const Joi = BaseJoi.extend(JoiTimezone)',
    "if (Joi.timezone().validate('Australia/Darwin').error !== undefined) throw new Error('esm: expected no validation error')"
  ].join('\n')

  run(process.execPath, ['--input-type=commonjs', '--eval', cjs], { cwd: workspace })
  run(process.execPath, ['--input-type=module', '--eval', esm], { cwd: workspace })
}

// `npm test` runs tav, which reinstalls node_modules/joi once per supported
// version and leaves the oldest behind. The type checks borrow that joi, so
// they can only run against a tree npm ci owns.
function assertTypedJoi () {
  const joi = require(path.join(repoRoot, 'node_modules', 'joi', 'package.json'))
  if (!joi.types && !joi.typings) {
    console.error(
      `node_modules/joi is ${joi.version}, which ships no type declarations ` +
      `(joi added them in ${MINIMUM_TYPED_JOI}).\n` +
      'Run `npm ci` first — `npm test` leaves an older joi behind.'
    )
    process.exit(1)
  }
}

function main () {
  assertTypedJoi()

  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'joi-tz-consumer-'))
  const failures = []

  try {
    const tarball = pack(workspace)
    stage(tarball, workspace)

    const checks = [
      ['tarball contents', () => assertTarballContents(tarball)],
      ['runtime import', () => smokeTest(workspace)],
      ...TSCONFIGS.map((tsconfig) => [tsconfig, () => typecheck(workspace, tsconfig)])
    ]

    for (const [name, check] of checks) {
      try {
        check()
        console.log(`  ok   ${name}`)
      } catch (error) {
        failures.push(name)
        console.log(`  FAIL ${name}`)
        const detail = `${error.stdout || ''}${error.stderr || ''}`.trim() || error.message
        console.log(detail.replace(/^/gm, '       '))
      }
    }
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true })
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} consumer check(s) failed: ${failures.join(', ')}`)
    process.exit(1)
  }
  console.log('\nAll consumer checks passed.')
}

main()
