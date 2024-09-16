import { expect, test, describe } from 'vitest';
import { Lexer } from '../src/lexer';

describe('Parser', () => {
    const lexer = new Lexer();
    const input = 'name:eq:"John"&(age:gt:30|city:eq:"New York")';
    const tokens = lexer.tokenize(input);

    test('parses string input', () => {
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

    // test('Parser returns correct types', () => {
    //     const tokens: qfilters.Token[] = [
    //         { type: 'group-start' },
    //         { type: 'filter-operation', field: 'category', operation: 'eq', value: '"electronics"' },
    //         { type: 'group-operator', operator: '|' },
    //         { type: 'filter-operation', field: 'category', operation: 'eq', value: '"books"' },
    //         { type: 'group-end' },
    //     ];
    // });
});
