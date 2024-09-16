import { expect, test, describe } from 'vitest';
import { FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter } from '../src/filters';

describe('Test subgroups', () => {
    const rootGroup = new FilterGroup({
        isRoot: true,
        operator: '|',
    });

    const subGroup1 = new FilterGroup({
        operator: '|',
    });

    subGroup1.addFilter(new StringFilter('category', 'eq', 'electronics'));
    subGroup1.addFilter(new StringFilter('category', 'eq', 'books'));

    const subGroup2 = new FilterGroup({
        operator: '&',
    });

    subGroup2.addFilter(new NumberFilter('price', 'gt', 100));
    subGroup2.addFilter(new BooleanFilter('inStock', 'eq', true));

    // add them in the order you expect them to be or-ed (as the group has the operator '|')
    rootGroup.addFilter(subGroup1);
    rootGroup.addFilter(subGroup2);
    rootGroup.addFilter(new DateFilter('createdAt', 'gt', new Date('2023-01-01')));

    test('toString returns the correct string', () => {
        expect(rootGroup.toString()).toBe(
            '(category:eq:electronics|category:eq:books)|(price:gt:100&inStock:eq:true)|createdAt:gt:2023-01-01T00:00:00.000Z',
        );
    });
});
