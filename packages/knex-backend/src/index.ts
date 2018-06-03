import * as knex from "knex";
import { KnexRepository } from "./KnexRepository";
import { EntityMapper, DefaultRecordMappingParams } from "@deoxys/repository";

/**
 * The primary factory function used to build a repository with knex-backend
 * 
 * @param source A knex query builder, Example: `knex.table('users')`
 * @param mapper 
 */
export const Repository = <RecordType, EntityType = RecordType, RecordMapperParams = DefaultRecordMappingParams>(
  source: knex.QueryBuilder,
  mapper?: EntityMapper<RecordType, EntityType, RecordMapperParams>
) => new KnexRepository(source, mapper);
