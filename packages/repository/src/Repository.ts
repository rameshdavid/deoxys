import { UtilTypes as U } from "./UtilTypes";
import { EntityMapper, DefaultRecordMappingParams } from "./MapperProxy";

export interface Repository<
  RecordType,
  EntityType = RecordType,
  RecordMappingParams = DefaultRecordMappingParams
> {
  mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>;
  findOne<Query, T extends Partial<EntityType> = EntityType>(
    query: Query,
    mappingParams?: RecordMappingParams
  ): Promise<U.Maybe<T>>;
  findMany<Query, T extends Partial<EntityType> = EntityType>(
    query: Query,
    mappingParams?: RecordMappingParams
  ): Promise<T[]>;
  insertOne(
    entity: EntityType,
    mappingParams?: RecordMappingParams
  ): Promise<any>;
  insertMany(
    entities: EntityType[],
    mappingParams?: RecordMappingParams
  ): Promise<any>;
  updateOne<T extends Partial<EntityType> = Partial<EntityType>>(
    entity: T,
    mappingParams?: RecordMappingParams
  ): Promise<any>;
  updateMany<T extends Partial<EntityType> = Partial<EntityType>>(
    entities: T[],
    mappingParams?: RecordMappingParams
  ): Promise<any>;
  deleteOne<Query>(query: Query): Promise<any>;
  deleteMany<Query>(query: Query): Promise<any>;
}

export type RepositoryFactory<
  RecordType,
  EntityType = RecordType,
  RecordMappingParams = DefaultRecordMappingParams
> = U.Factory<Repository<RecordType, EntityType, RecordMappingParams>>;
