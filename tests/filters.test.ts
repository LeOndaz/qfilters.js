import { expect, test, describe } from 'vitest';
import { FilterBuilder } from '../src/builder';
import { StringFilter, NumberFilter, BooleanFilter, DateFilter, FilterGroup } from '../src/filters';

describe('FilterBuilder', () => {
    test('build simple AND filter with different types', () => {
        const builder = new FilterBuilder(FilterGroup, {
            separator: ' ',
            logicalOperator: 'and',
        });

        builder
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new NumberFilter('price', 'lt', 20))
            .addFilter(new BooleanFilter('inStock', 'eq', true))
            .addFilter(new DateFilter('publishedAfter', 'gt', new Date('2023-01-01')));
        const result = builder.build();
        expect(result).toBe(
            'category:eq:books AND price:lt:20 AND inStock:eq:true AND publishedAfter:gt:2023-01-01T00:00:00.000Z',
        );
    });

    test('build simple OR group', () => {
        const builder = new FilterBuilder(FilterGroup, {
            separator: ' ',
            logicalOperator: 'or',
        });

        builder
            .group('or')
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new StringFilter('category', 'eq', 'electronics'))
            .endGroup();
        const result = builder.build();
        expect(result).toBe('(category:eq:books OR category:eq:electronics)');
    });

    test('build AND group with OR subgroup', () => {
        const builder = new FilterBuilder(FilterGroup, {
            separator: ' ',
            logicalOperator: 'and',
        });
        builder
            .addFilter(new BooleanFilter('inStock', 'eq', true))
            .group('or')
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new StringFilter('category', 'eq', 'electronics'))
            .endGroup()
            .addFilter(new NumberFilter('price', 'lt', 100));
        const result = builder.build();
        expect(result).toBe('inStock:eq:true AND (category:eq:books OR category:eq:electronics) AND price:lt:100');
    });

    test('build complex nested groups', () => {
        const builder = new FilterBuilder(FilterGroup, {
            separator: ' ',
            logicalOperator: 'and',
        });
        builder
            .group('or')
            .addFilter(new StringFilter('category', 'eq', 'electronics'))
            .group('and')
            .addFilter(new StringFilter('brand', 'eq', 'Apple'))
            .group('or')
            .addFilter(new StringFilter('model', 'eq', 'iPhone'))
            .addFilter(new StringFilter('model', 'eq', 'iPad'))
            .endGroup()
            .endGroup()
            .endGroup()
            .addFilter(new BooleanFilter('inStock', 'eq', true));
        const result = builder.build();

        expect(result).toBe(
            '(category:eq:electronics OR (brand:eq:Apple AND (model:eq:iPhone OR model:eq:iPad))) AND inStock:eq:true',
        );
    });
});
