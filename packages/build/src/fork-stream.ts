/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import File = require('vinyl');
import * as gulpFilter from 'gulp-filter';

import {AsyncTransformStream} from './streams';

export function forkStream(stream: NodeJS.ReadableStream, filter?: string[] ):
// export function forkStream(stream: NodeJS.ReadableStream):
    NodeJS.ReadableStream {

  // note we should filter earlier on.
  const fork = new ForkedVinylStream();
  filter = ['**', '!**/firebase/**', '!**/web_modules/**'];
  if (filter) {
    console.info('filtering stream with : ', filter);
    stream = stream.pipe(gulpFilter(filter));
  }
  stream.pipe(fork);
  return fork;
}

/**
 * Forks a stream of Vinyl files, cloning each file before emitting on the fork.
 */
export class ForkedVinylStream extends AsyncTransformStream<File, File> {
  constructor() {
    super({objectMode: true});
  }

  protected async *
      _transformIter(files: AsyncIterable<File>): AsyncIterable<File> {
    for await (const file of files) {
      console.info('fork stream file: ', file.path);
      yield file.clone({deep: true, contents: true});
    }
  }
}
