import sanitizeHtml from 'sanitize-html';
import { strictSanitizationRule } from './sanitize_rules/strict';

export function sanitizeInput(input: string): string {
    return sanitizeHtml(input, strictSanitizationRule);
}
