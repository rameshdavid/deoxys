import * as knex from "knex";
import { KnexRepository } from "./KnexRepository";
import { EntityMapper } from "@deoxys/repository";

/**
 * The primary factory function used to build a repository with knex-backend
 * 
 * @param source A knex query builder, Example: `knex.table('users')`
 * @param mapper 
 */
export const Repository = <R, E, M>(
  source: knex.QueryBuilder,
  mapper: EntityMapper<R, E, M>
) => new KnexRepository(source, mapper);
