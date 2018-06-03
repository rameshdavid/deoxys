import { EntityMapper } from "./EntityMapper";

/**
 * A no-op EntityMapper implementation for the common case when Entity and Record types are the same
 * and thus no mapping is required.
 */
export class IdentityMapper implements EntityMapper<any, any> {
    mapRecordToEntity(record: any) {
        return record;
    }
    mapEntityToRecord(entity: any) {
        return entity;
    }
}