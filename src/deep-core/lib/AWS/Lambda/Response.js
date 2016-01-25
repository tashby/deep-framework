/**
 * Created by AlexanderC on 5/25/15.
 */

'use strict';

import {MissingRuntimeContextException} from './Exception/MissingRuntimeContextException';
import {ContextAlreadySentException} from './Exception/ContextAlreadySentException';

/**
 * Response sent to the lambda context
 */
export class Response {
  /**
   * @param {Runtime} runtime
   * @param {Object} data
   */
  constructor(runtime, data) {
    this._data = data;
    this._runtime = runtime;
  }

  /**
   * @returns {Runtime}
   */
  get runtime() {
    return this._runtime;
  }

  /**
   * @returns {Boolean}
   */
  get contextSent() {
    return this._runtime.contextSent;
  }

  /**
   * @returns {Log}
   */
  get logService() {
    return this.runtime.kernel.get('log');
  }

  /**
   * @returns {Response}
   */
  send() {
    if (!this._runtime.context) {
      throw new MissingRuntimeContextException();
    } else if (this.contextSent) {
      throw new ContextAlreadySentException();
    }

    // flush RUM batched messages if any
    this.logService.rumFlush();

    // @todo: via setter?
    this._runtime._contextSent = true;

    this._runtime.context[this.constructor.contextMethod](this.data);

    return this;
  }

  /**
   *
   * @returns {Object}
   * @private
   */
  get data() {
    return this._data;
  }

  /**
   * @returns {Object}
   */
  get rawData() {
    return this._data;
  }

  /**
   * @returns {String}
   */
  static get contextMethod() {
    return 'succeed';
  }
}
