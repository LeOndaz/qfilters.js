import { expect, test, describe } from 'vitest';
import { Lexer } from '../src/lexer';
import * as qfilters from '../src/types';

describe('Lexer', () => {
    const lexer = new Lexer();

    test('lexes string input', () => {
        const input = 'name:eq:John and (age:gt:30 or city:eq:"New York")';
        const tokens = lexer.lex(input);

        expect(tokens).toEqual([
            { type: qfilters.TokenType.Filter, field: 'name', operator: 'eq', value: 'John' },
            { type: qfilters.TokenType.LogicalOperator, value: 'and' },
            { type: qfilters.TokenType.GroupStart },
            { type: qfilters.TokenType.Filter, field: 'age', operator: 'gt', value: '30' },
            { type: qfilters.TokenType.LogicalOperator, value: 'or' },
            { type: qfilters.TokenType.Filter, field: 'city', operator: 'eq', value: 'New York' },
            { type: qfilters.TokenType.GroupEnd },
        ]);
    });

    test('lexes string input without quotes', () => {
        // Incorrect synyax, notice (New York) has spacing
        const input = 'name:eq:John and (age:gt:30 or city:eq:New York)';
        expect(() => lexer.lex(input)).not.toThrow();
    });

    test('lex objects', () => {
        const input = {
            'name:eq': 'John',
            filter: 'age:gt:30 or city:eq:"New York"',
        };
        const tokens = lexer.lex(input);

        expect(tokens).toEqual([
            { type: qfilters.TokenType.Filter, field: 'name', operator: 'eq', value: 'John' },
            { type: qfilters.TokenType.Filter, field: 'age', operator: 'gt', value: '30' },
            { type: qfilters.TokenType.LogicalOperator, value: 'or' },
            { type: qfilters.TokenType.Filter, field: 'city', operator: 'eq', value: 'New York' },
        ]);
    });
});
