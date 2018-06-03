import * as knex from "knex";
import { KnexRepository } from "./KnexRepository";
import { EntityMapper } from "@deoxys/repository";

export const Repository = <R, E, M>(
  source: knex.QueryBuilder,
  mapper: EntityMapper<R, E, M>
) => new KnexRepository(source, mapper);
