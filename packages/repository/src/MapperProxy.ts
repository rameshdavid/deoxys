import { DefaultRecordMappingParams, EntityMapper } from "./EntityMapper";

/**
 * Convenience class that delegates to an EntityMapper and provides default implementations for some methods
 * which the EntityMapper implementation can choose to forgo.
 */
export class MapperProxy<
  RecordType,
  EntityType,
  RecordMappingParams = DefaultRecordMappingParams
> implements EntityMapper<RecordType, EntityType, RecordMappingParams> {

  /**
   * Underlying entity mapper.
   */
  mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>;
  constructor(
    mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>
  ) {
    this.mapper = mapper;
  }

  /**
   * Maps a single record (from the source) to a single (domain specific) entity
   * 
   * @param record 
   * @param mappingParams 
   */
  mapRecordToEntity<R, E>(
    record: R,
    mappingParams?: RecordMappingParams | undefined
  ): E | Promise<E> {
    return this.mapper.mapRecordToEntity<R, E>(record, mappingParams);
  }

  /**
   * Maps a single (domain specific) entity to a record (from the source) which the store expects
   * 
   * @param record 
   * @param mappingParams 
   */
  mapEntityToRecord<R, E>(
    entity: E,
    mappingParams?: RecordMappingParams | undefined
  ): R | Promise<R> {
    return this.mapper.mapEntityToRecord<R, E>(entity, mappingParams);
  }

  /**
   * Maps a collection of records to a collection of entities
   * 
   * @param records 
   * @param mappingParams 
   */
  mapRecordsToEntities<R, E>(
    records: R[],
    mappingParams?: RecordMappingParams | undefined
  ): E[] | Promise<E[]> {
    if (this.mapper.mapRecordsToEntities) {
      return this.mapper.mapRecordsToEntities<R, E>(records, mappingParams);
    }
    return Promise.all(
      records.map(r => this.mapRecordToEntity<R, E>(r, mappingParams))
    );
  }

  /**
   * Maps a collection of entities to a collection of records
   * 
   * @param entities 
   * @param mappingParams 
   */
  mapEntitiesToRecords<R, E>(
    entities: E[],
    mappingParams?: RecordMappingParams | undefined
  ) {
    if (this.mapper.mapEntitiesToRecords) {
      return this.mapper.mapEntitiesToRecords<R, E>(entities, mappingParams);
    }
    return Promise.all(
      entities.map(e => this.mapper.mapEntityToRecord<R, E>(e, mappingParams))
    );
  }
}
