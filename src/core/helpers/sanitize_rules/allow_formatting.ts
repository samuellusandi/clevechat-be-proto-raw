import sanitize from 'sanitize-html';

export const allowFormattingRules: sanitize.IOptions = {
    allowedAttributes: {},
    allowedTags: [
        'b',
        'i',
        'em',
        'strong',
        'u',
        'sup',
        'sub',
        's',
    ],
};
