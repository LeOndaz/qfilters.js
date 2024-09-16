import { expect, test, describe } from 'vitest';
import { FilterBuilder } from '../src/builder';
import { StringFilter, NumberFilter, BooleanFilter, DateFilter, FilterGroup } from '../src/filters';

describe('FilterBuilder', () => {
    test('build simple (AND) filter with different types', () => {
        const builder = new FilterBuilder(FilterGroup, {
            operator: '&',
        });

        builder
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new NumberFilter('price', 'lt', 20))
            .addFilter(new BooleanFilter('inStock', 'eq', true))
            .addFilter(new DateFilter('publishedAfter', 'gt', new Date('2023-01-01')));
        const result = builder.build();

        expect(result).toBe('category:eq:books&price:lt:20&inStock:eq:true&publishedAfter:gt:2023-01-01T00:00:00.000Z');
    });

    test('build simple (OR) group', () => {
        const builder = new FilterBuilder(FilterGroup, {
            operator: '|',
        });

        builder
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new StringFilter('category', 'eq', 'electronics'));

        const result = builder.build();
        expect(result).toBe('category:eq:books|category:eq:electronics');
    });

    test('build (AND) group with (OR) subgroup', () => {
        const builder = new FilterBuilder(FilterGroup, {
            operator: '&',
        });

        builder
            .addFilter(new BooleanFilter('inStock', 'eq', true))
            .group('|')
            .addFilter(new StringFilter('category', 'eq', 'books'))
            .addFilter(new StringFilter('category', 'eq', 'electronics'))
            .endGroup()
            .addFilter(new NumberFilter('price', 'lt', 100));

        const result = builder.build();
        expect(result).toBe('inStock:eq:true&(category:eq:books|category:eq:electronics)&price:lt:100');
    });

    test('build complex nested groups', () => {
        const builder = new FilterBuilder(FilterGroup, {
            operator: '&',
        });
        builder
            .addFilter(new StringFilter('category', 'eq', 'electronics'))
            .group('&')
            .addFilter(new StringFilter('brand', 'eq', 'Apple'))
            .group('&')
            .addFilter(new StringFilter('model', 'eq', 'iPhone'))
            .addFilter(new StringFilter('model', 'eq', 'iPad'))
            .endGroup()
            .endGroup()
            .endGroup()
            .addFilter(new BooleanFilter('inStock', 'eq', true));
        const result = builder.build();

        expect(result).toBe('category:eq:electronics&(brand:eq:Apple&(model:eq:iPhone&model:eq:iPad))&inStock:eq:true');
        expect(result).toBe(builder.toString());
    });
});
