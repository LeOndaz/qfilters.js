import { expect, describe } from 'vitest';
import { Lexer } from '../src/lexer';
import { test } from './fixtures';

describe('Lexer', () => {
    const lexer = new Lexer();

    test('lexes string input', () => {
        const input = 'name:eq:John&(age:gt:30|city:eq:"New York")';
        const tokens = lexer.tokenize(input);

        expect(tokens).toEqual([
            { type: 'filter-operation', field: 'name', operation: 'eq', value: 'John' },
            { type: 'group-operator', operator: '&' },
            { type: 'group-start' },
            { type: 'filter-operation', field: 'age', operation: 'gt', value: '30' },
            { type: 'group-operator', operator: '|' },
            { type: 'filter-operation', field: 'city', operation: 'eq', value: 'New York' },
            { type: 'group-end' },
        ]);
    });

    test("lexes string input without quotes shouldn't throw", () => {
        // Incorrect synyax, notice (New York) has spacing
        const input = 'name:eq:John&(age:gt:30|city:eq:New York)';
        expect(() => lexer.tokenize(input)).not.toThrow();
    });

    test('Lexer returns correct tokens', ({ rootGroup, rootGroupTokens }) => {
        const tokens = lexer.tokenize(rootGroup.toString());
        expect(tokens).toEqual(rootGroupTokens);
    });
});
