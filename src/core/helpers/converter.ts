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
