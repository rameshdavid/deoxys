import * as knex from "knex";
import {
  Repository,
  EntityMapper,
  UtilTypes as U,
  MapperProxy,
  IdentityMapper
} from "@deoxys/repository";

export type QueryParam<T extends {} = {}> = T | ((source: knex.QueryBuilder) => knex.QueryBuilder);

/**
 * Implements a repository backed by knex - a flexible and portal SQL query buidler which supports
 * many relational databases
 */
export class KnexRepository<R, E, M> implements Repository<R, E, M> {
  private source: knex.QueryBuilder;
  mapper: MapperProxy<R, E, M>;

  constructor(source: knex.QueryBuilder, mapper: EntityMapper<R, E, M> = new IdentityMapper) {
    this.source = source;
    this.mapper = new MapperProxy(mapper);
  }

  where<T = {}>(query: QueryParam<T>): knex.QueryBuilder {
    if (typeof query === 'function') {
        return query(this.source);
    }
    return this.source.where(query);
  }

  async findOne<Q, T>(
    query: QueryParam<Q>,
    mappingParams?: M
  ): Promise<U.Maybe<T>> {
    const record: R = await this.where(query).first();
    if (!record) return null;
    return this.mapper.mapRecordToEntity<R, T>(record, mappingParams);
  }

  async findMany<Q, T>(query: QueryParam<Q>, mappingParams?: M): Promise<T[]> {
    const records: R[] = await this.where(query);
    return this.mapper.mapRecordsToEntities<R, T>(records, mappingParams);
  }

  async insertOne(entity: E, mappingParams?: M, ...args: any[]) {
    const record = await this.mapper.mapEntityToRecord<R, E>(entity, mappingParams);
    return await this.source.insert(record, ...args);
  }

  async insertMany(entities: E[], mappingParams?: M, ...args: any[]) {
    const records = await this.mapper.mapEntitiesToRecords<R, E>(
      entities,
      mappingParams
    );
    return await this.source.insert(records, ...args);
  }

  async updateOne<T>(entity: T, mappingParams?: M) {
    const record = await this.mapper.mapEntityToRecord<Partial<R>, T>(
        entity,
        mappingParams
    );
    return await this.source.update(record);
  }

  async updateMany<T>(entities: T[], mappingParams?: M) {
    const records = await this.mapper.mapEntitiesToRecords<Partial<R>, T>(
        entities,
        mappingParams
    );
    return await this.source.update(records);
  }

  async deleteOne<Query>(query: Query) {
    return await this.source.where(query).del();
  }

  async deleteMany<Query>(query: Query) {
    return await this.source.where(query).limit(1).del();
  }
}
