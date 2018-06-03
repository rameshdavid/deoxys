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
