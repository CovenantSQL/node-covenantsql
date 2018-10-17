/**
 * Copyright 2018 The CovenantSQL Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Connection from './Connection.js';
import ConnectionConfig from './ConnectionConfig'

/**
 * Format SQL and replacement values into a SQL string.
 * @param  {[type]} sql The SQL for the query
 * @param  {Array} [values] Any values to insert into placeholders in sql
 * @return {String} Formatted SQL string
 */
export const format = (sql, values) => {
  return Connection.format(sql, values)
}

/**
 * Create a new connection instance
 * @param  {Object} Config configuration for new ConvenantSQL connection
 * @return {Connection} A new ConvenantSQL connection
 * @public
 */
export const createConnection = (config) => {
  return new Connection({ config: new ConnectionConfig(config) })
}
