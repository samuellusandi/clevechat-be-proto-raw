import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input: string, rule: sanitizeHtml.IOptions): string {
    return sanitizeHtml(input, rule);
}
