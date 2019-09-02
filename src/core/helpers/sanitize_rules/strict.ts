import sanitize from 'sanitize-html';

export const strictSanitizationRule: sanitize.IOptions = {
    allowedAttributes: {},
    allowedTags: [],
};
