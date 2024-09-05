import { expect, test, describe } from 'vitest';
import { FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter } from '../src/filters';

describe('Test subgroups', () => {
    const rootGroup = new FilterGroup({
        isRoot: true,
        separator: ' ',
        logicalOperator: 'or',
    });

    const subGroup1 = rootGroup.subgroup('or');
    subGroup1.addFilter(new StringFilter('category', 'eq', 'electronics'));
    subGroup1.addFilter(new StringFilter('category', 'eq', 'books'));

    const subGroup2 = rootGroup.subgroup('and');
    subGroup2.addFilter(new NumberFilter('price', 'gt', 100));
    subGroup2.addFilter(new BooleanFilter('inStock', 'eq', true));

    rootGroup.addFilter(new DateFilter('createdAt', 'gt', new Date('2023-01-01')));

    test('toString', () => {
        expect(rootGroup.toString()).toBe(
            '(category:eq:electronics OR category:eq:books) OR (price:gt:100 AND inStock:eq:true) OR createdAt:gt:2023-01-01T00:00:00.000Z',
        );
    });

    test('subgroup has correct separator (whitespace)', () => {
        expect(rootGroup.subgroup('or')).toHaveProperty('separator', ' ');
        expect(rootGroup.subgroup('and')).toHaveProperty('separator', ' ');
        expect(rootGroup.subgroup('or').subgroup('and')).toHaveProperty('separator', ' ');
        expect(rootGroup.subgroup('and').subgroup('or')).toHaveProperty('separator', ' ');
        expect(rootGroup.subgroup('or').subgroup('and').subgroup('or')).toHaveProperty('separator', ' ');
        expect(rootGroup.subgroup('and').subgroup('or').subgroup('and')).toHaveProperty('separator', ' ');
    });
});
