import cassandra from 'cassandra-driver';

function deepResolveBoolean(value: string): boolean {
    const asNumeric = +value;
    return !isNaN(asNumeric) && asNumeric !== 0;
}

export function resolveBoolean(value: string): boolean {
    value = value.toLowerCase();
    switch (value) {
        case 'true':
        case 'yes':
        case 'on':
            return true;
        default:
            return deepResolveBoolean(value);
    }
}

export function convertStringToUuid(value: string): cassandra.types.Uuid {
    return cassandra.types.Uuid.fromString(value);
}

export function convertUuidToString(value: cassandra.types.Uuid): string {
    return value.toString();
}
