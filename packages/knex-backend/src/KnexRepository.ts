import * as knex from "knex";
import {
  Repository,
  EntityMapper,
  UtilTypes as U,
  MapperProxy,
  IdentityMapper,
  DefaultRecordMappingParams
} from "@deoxys/repository";

export type QueryParam<T extends {} = {}> =
  | T
  | ((source: knex.QueryBuilder) => knex.QueryBuilder);

/**
 * Implements a repository backed by knex - a flexible and portal SQL query buidler which supports
 * many relational databases
 */
export class KnexRepository<
  RecordType,
  EntityType = RecordType,
  RecordMappingParams = DefaultRecordMappingParams
> implements Repository<RecordType, EntityType, RecordMappingParams> {

  private _source: knex.QueryBuilder;
  mapper: MapperProxy<RecordType, EntityType, RecordMappingParams>;

  constructor(
    source: knex.QueryBuilder,
    mapper: EntityMapper<
      RecordType,
      EntityType,
      RecordMappingParams
    > = new IdentityMapper()
  ) {
    this._source = source;
    this.mapper = new MapperProxy(mapper);
  }

  get source() {
    return this._source.clone();
  }

  where<T = {}>(query: QueryParam<T>): knex.QueryBuilder {
    if (typeof query === "function") {
      return query(this.source);
    }
    return this.source.where(query);
  }

  async findOne<Query, T extends Partial<EntityType> = EntityType>(
    query: QueryParam<Query>,
    mappingParams?: RecordMappingParams
  ): Promise<U.Maybe<T>> {
    const record: RecordType = await this.where(query).first();
    if (!record) return null;
    return this.mapper.mapRecordToEntity<RecordType, T>(record, mappingParams);
  }

  async findMany<Query, T extends Partial<EntityType> = EntityType>(
    query: QueryParam<Query>,
    mappingParams?: RecordMappingParams
  ): Promise<T[]> {
    const records: RecordType[] = [].concat(await this.where(query).select());
    return this.mapper.mapRecordsToEntities<RecordType, T>(
      records,
      mappingParams
    );
  }

  async insertOne(
    entity: EntityType,
    mappingParams?: RecordMappingParams,
    ...args: any[]
  ) {
    const record = await this.mapper.mapEntityToRecord<RecordType, EntityType>(
      entity,
      mappingParams
    );
    return await this.source.insert(record, ...args);
  }

  async insertMany(
    entities: EntityType[],
    mappingParams?: RecordMappingParams,
    ...args: any[]
  ) {
    const records = await this.mapper.mapEntitiesToRecords<
      RecordType,
      EntityType
    >(entities, mappingParams);
    return await this.source.insert(records, ...args);
  }

  async updateOne<T extends Partial<EntityType> = Partial<EntityType>>(
    entity: T,
    mappingParams?: RecordMappingParams
  ) {
    const record = await this.mapper.mapEntityToRecord<Partial<RecordType>, T>(
      entity,
      mappingParams
    );
    return await this.source.update(record);
  }

  async updateMany<T extends Partial<EntityType> = Partial<EntityType>>(
    entities: T[],
    mappingParams?: RecordMappingParams
  ) {
    const records = await this.mapper.mapEntitiesToRecords<
      Partial<RecordType>,
      T
    >(entities, mappingParams);
    return await this.source.update(records);
  }

  async deleteOne<Query>(query: Query) {
    return await this.source
      .where(query)
      .limit(1)
      .del();
  }

  async deleteMany<Query>(query: Query) {
    return await this.source.where(query).del();
  }
}
