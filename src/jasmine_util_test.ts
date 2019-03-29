/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from './environment';
import * as tf from './index';
import {describeWithFlags, envSatisfiesConstraints, parseKarmaFlags, TestKernelBackend} from './jasmine_util';

describeWithFlags('jasmine_util.envSatisfiesConstraints', {}, () => {
  it('ENV satisfies empty constraints', () => {
    expect(envSatisfiesConstraints({})).toBe(true);
  });

  it('ENV satisfies matching constraints', () => {
    const c = {DEBUG: ENV.get('DEBUG')};
    expect(envSatisfiesConstraints(c)).toBe(true);
  });

  it('ENV does not satisfy mismatching constraints', () => {
    const c = {DEBUG: !ENV.get('DEBUG')};
    expect(envSatisfiesConstraints(c)).toBe(false);
  });
});

describe('jasmine_util.parseKarmaFlags', () => {
  it('parse empty args', () => {
    const res = parseKarmaFlags([]);
    expect(res).toBeNull();
  });

  it('--backend test-backend --flags {"IS_NODE": true}', () => {
    const backend = new TestKernelBackend();
    tf.registerBackend('test-backend', () => backend);

    const res = parseKarmaFlags(
        ['--backend', 'test-backend', '--flags', '{"IS_NODE": true}']);
    expect(res.name).toBe('test-backend');
    expect(res.flags).toEqual({IS_NODE: true});
    expect(res.factory() === backend).toBe(true);

    tf.removeBackend('test-backend');
  });

  it('"--backend unknown" throws error', () => {
    expect(() => parseKarmaFlags(['--backend', 'unknown'])).toThrowError();
  });

  it('"--flags {}" throws error since --backend is missing', () => {
    expect(() => parseKarmaFlags(['--flags', '{}'])).toThrowError();
  });

  it('"--backend cpu --flags" throws error since features value is missing',
     () => {
       expect(() => parseKarmaFlags(['--backend', 'cpu', '--flags']))
           .toThrowError();
     });

  it('"--backend cpu --flags notJson" throws error', () => {
    expect(() => parseKarmaFlags(['--backend', 'cpu', '--flags', 'notJson']))
        .toThrowError();
  });
});
