export interface DefaultRecordMappingParams {
  isPartial: boolean;
}

export interface EntityMapper<
  RecordType,
  EntityType,
  RecordMappingParams = DefaultRecordMappingParams
> { 
  mapRecordToEntity<
    R extends Partial<RecordType> = RecordType,
    E extends Partial<EntityType> = EntityType
  >(
    record: R,
    mappingParams?: RecordMappingParams
  ): E | Promise<E>;
  mapEntityToRecord<
    R extends Partial<RecordType> = RecordType,
    E extends Partial<EntityType> = EntityType
  >(
    entity: E,
    mappingParams?: RecordMappingParams
  ): R | Promise<R>;
  mapRecordsToEntities?: <
    R extends Partial<RecordType> = RecordType,
    E extends Partial<EntityType> = EntityType
  >(
    records: R[],
    mappingParams?: RecordMappingParams
  ) => E[] | Promise<E[]>;
  mapEntitiesToRecords?: <
    R extends Partial<RecordType> = RecordType,
    E extends Partial<EntityType> = EntityType
  >(
    entities: E[],
    mappingParams?: RecordMappingParams
  ) => R[] | Promise<R[]>;
}

export class MapperProxy<
  RecordType,
  EntityType,
  RecordMappingParams = DefaultRecordMappingParams
> implements EntityMapper<RecordType, EntityType, RecordMappingParams> {
  mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>;
  constructor(
    mapper: EntityMapper<RecordType, EntityType, RecordMappingParams>
  ) {
    this.mapper = mapper;
  }
  mapRecordToEntity<R, E>(
    record: R,
    mappingParams?: RecordMappingParams | undefined
  ): E | Promise<E> {
    return this.mapper.mapRecordToEntity<R, E>(record, mappingParams);
  }
  mapEntityToRecord<R, E>(
    entity: E,
    mappingParams?: RecordMappingParams | undefined
  ): R | Promise<R> {
    return this.mapper.mapEntityToRecord<R, E>(entity, mappingParams);
  }
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
