import { expect, test, describe } from 'vitest';
import { Lexer } from '../src/lexer';

describe('Lexer', () => {
    const lexer = new Lexer();

    test('lexes string input', () => {
        const input = 'name:eq:John and (age:gt:30 or city:eq:"New York")';
        const tokens = lexer.lex(input);

        expect(tokens).toEqual([
            { type: QFilters.TokenType.Filter, field: 'name', operator: 'eq', value: 'John' },
            { type: QFilters.TokenType.LogicalOperator, value: 'and' },
            { type: QFilters.TokenType.GroupStart },
            { type: QFilters.TokenType.Filter, field: 'age', operator: 'gt', value: '30' },
            { type: QFilters.TokenType.LogicalOperator, value: 'or' },
            { type: QFilters.TokenType.Filter, field: 'city', operator: 'eq', value: 'New York' },
            { type: QFilters.TokenType.GroupEnd },
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
            { type: QFilters.TokenType.Filter, field: 'name', operator: 'eq', value: 'John' },
            { type: QFilters.TokenType.Filter, field: 'age', operator: 'gt', value: '30' },
            { type: QFilters.TokenType.LogicalOperator, value: 'or' },
            { type: QFilters.TokenType.Filter, field: 'city', operator: 'eq', value: 'New York' },
        ]);
    });
});
