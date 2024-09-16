import { expect, describe } from 'vitest';
import { test } from './fixtures';
import { Token } from '../src/types';
import { FilterGroup, NumberFilter, StringFilter } from '../src/filters';

describe('Parser', () => {
    const input = 'name:eq:"John"&(age:gt:30|city:eq:"New York")';

    test('parses string input', ({ lexer }) => {
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

    test('Parser returns correct types', ({ parser }) => {
        const tokens: Token[] = [
            { type: 'group-start' },
            { type: 'filter-operation', field: 'category', operation: 'eq', value: 'electronics' },
            { type: 'group-operator', operator: '|' },
            { type: 'filter-operation', field: 'category', operation: 'eq', value: 'books' },
            { type: 'group-end' },
        ];

        const ast = parser.parse(tokens);

        const expected = new FilterGroup({ operator: '|', isRoot: true });
        expected.addFilter(new StringFilter('category', 'eq', 'electronics'));
        expected.addFilter(new StringFilter('category', 'eq', 'books'));

        expect(ast).toEqual(expected);
    });

    test('nested groups', ({ parser, lexer }) => {
        const input = 'name:eq:"John"&age:gt:30&(city:eq:"New York"|country:eq:"USA")';
        const tokens = lexer.tokenize(input);
        const ast = parser.parse(tokens);

        const expected = new FilterGroup({ operator: '&', isRoot: true });
        expected.addFilter(new StringFilter('name', 'eq', 'John'));
        expected.addFilter(new NumberFilter('age', 'gt', 30));

        const nestedGroup = new FilterGroup({ operator: '|' });
        nestedGroup.addFilter(new StringFilter('city', 'eq', 'New York'));
        nestedGroup.addFilter(new StringFilter('country', 'eq', 'USA'));
        expected.addFilter(nestedGroup);

        expect(ast).toEqual(expected);
    });

    test('incorrect grouping', ({parser, lexer }) => {
        const input = ')name:eq:"jhon"(';

        const tokens = lexer.tokenize(input);
        expect(() => parser.parse(tokens)).toThrow();
    });
});
