/**
 * Simualated Module Exports
 *
 * This script builds the modules that will be consumed publically. They front the actual code inside ./dist.
 * The problem being solved here is that it allows consumers to do e.g. this:
 *
 *     Import { ... } from 'nexus/testing'
 *
 * Instead of:
 *
 *     Import { ... } from 'nexus/dist/testing'
 *
 * Whatever modules are written here should be:
 *
 * 1. ignored in .gitignore.                     <-- YOU MUST DO THIS MANUALLY
 * 2. added to the package.json files array      <-- Automated for you
 */

// TODO automate gitignore step

import * as fs from 'fs-jetpack'
import * as lo from 'lodash'
import * as os from 'os'
import * as path from 'path'
import { PackageJson } from 'type-fest'

simulatePackageExports([
  ['providers.d.ts', "export * from './dist-cjs/entrypoints/providers'"],
  ['providers.js', "module.exports = require('./dist-cjs/entrypoints/providers')"],
])

function simulatePackageExports(facades: ModuleFacade[]) {
  // Write facade files

  for (const facade of facades) {
    fs.write(facade[0], facade[1] + os.EOL)
  }

  // Handle package.json files array

  const packageJsonPath = path.join(__dirname, '..', 'package.json')
  const packageJson = fs.read(packageJsonPath, 'json') as PackageJson

  packageJson.files = lo.uniq([...(packageJson.files ?? []), ...facades.map((facade) => facade[0])])

  const packageJsonString = JSON.stringify(packageJson, null, 2) + os.EOL

  fs.write(packageJsonPath, packageJsonString)
}

type ModuleFacade = [filePath: string, fileContents: string]
