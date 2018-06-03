import { UtilTypes as U } from "./UtilTypes";
import { EntityMapper, DefaultRecordMappingParams } from "./EntityMapper";

/**
 * Defines the primary contract for the Repository implementation exposed by the repository implementations in all backends
 * 
 * While Repository implementation defines the basic CRUD operations, and provides a unified API for them, specialized
 * repository implementations may provide extended APIs to support additional facilities suited to the stores they represent.
 */
export interface Repository<
  RecordType,
  EntityType = RecordType,
  RecordMappingParams = DefaultRecordMappingParams
> {

  /**
   * Entity Mapper used by this store
   */
  mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>;

  /**
   * Locate and fetch a single entity using specified query parameters
   * 
   * @param query An object/function provided in a store specific format which can be used to query the underlying data source
   * @param mappingParams 
   */
  findOne<Query, T extends Partial<EntityType> = EntityType>(
    query: Query,
    mappingParams?: RecordMappingParams
  ): Promise<U.Maybe<T>>;

  /**
   * Locate and fetch all matching entities using specified query parameters.
   * 
   * @param query  An object/function provided in a store specific format which can be used to query the underlying data source
   * @param mappingParams 
   */
  findMany<Query, T extends Partial<EntityType> = EntityType>(
    query: Query,
    mappingParams?: RecordMappingParams
  ): Promise<T[]>;

  /**
   * Insert a single entity in the store
   * 
   * @param entity 
   * @param mappingParams 
   */
  insertOne(
    entity: EntityType,
    mappingParams?: RecordMappingParams
  ): Promise<any>;

  /**
   * Insert multiple entities in the store.
   * 
   * For stores that support atomicity and transactional inserts, this is expected to be a single atomic operation
   * 
   * @param entities 
   * @param mappingParams 
   */
  insertMany(
    entities: EntityType[],
    mappingParams?: RecordMappingParams
  ): Promise<any>;

  /**
   * Update a single entity in the store
   * 
   * @param entity 
   * @param mappingParams 
   */
  updateOne<T extends Partial<EntityType> = Partial<EntityType>>(
    entity: T,
    mappingParams?: RecordMappingParams
  ): Promise<any>;

  /**
   * Update multiple entities to the store
   * 
   * For stores that support atomicity and transactional updates, this is expected to be a single atomic operation
   * @param entities 
   * @param mappingParams 
   */
  updateMany<T extends Partial<EntityType> = Partial<EntityType>>(
    entities: T[],
    mappingParams?: RecordMappingParams
  ): Promise<any>;

  /**
   * Delete a single entity from the store
   * 
   * @param query
   */
  deleteOne<Query>(query: Query): Promise<any>;

  /**
   * Delete all entities matching the specified query from the store
   * 
   * @param query 
   */
  deleteMany<Query>(query: Query): Promise<any>;
}

export type RepositoryFactory<
  RecordType,
  EntityType = RecordType,
  RecordMappingParams = DefaultRecordMappingParams
> = U.Factory<Repository<RecordType, EntityType, RecordMappingParams>>;
