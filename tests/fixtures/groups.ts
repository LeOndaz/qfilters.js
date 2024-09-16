import { FilterGroup, NumberFilter } from '../../src';
import { Token } from '../../src/types';

export const rootGroup = new FilterGroup({
    isRoot: true,
    operator: '&',
});

const group2 = new FilterGroup({
    isRoot: false,
    operator: '|',
});

const group3 = new FilterGroup({
    isRoot: false,
    operator: '&',
});

const group4 = new FilterGroup({
    isRoot: false,
    operator: '|',
});

rootGroup.addFilter(group2);

group2.addFilter(new NumberFilter('price', 'gt', 100));

group2.addFilter(group3);

group3.addFilter(new NumberFilter('price', 'lt', 200));

group3.addFilter(group4);

group4.addFilter(new NumberFilter('price', 'lt', 200));

group4.addFilter(new NumberFilter('price', 'lt', 200));

rootGroup.addFilter(group2);
rootGroup.addFilter(group3);

export const groups: FilterGroup[] = [rootGroup, group2, group3, group4];

export const rootGroupTokens: Token[] = [
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'gt', value: '100' },
    { type: 'group-operator', operator: '|' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '&' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '|' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-end' },
    { type: 'group-end' },
    { type: 'group-end' },
    { type: 'group-operator', operator: '&' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'gt', value: '100' },
    { type: 'group-operator', operator: '|' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '&' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '|' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-end' },
    { type: 'group-end' },
    { type: 'group-end' },
    { type: 'group-operator', operator: '&' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '&' },
    { type: 'group-start' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-operator', operator: '|' },
    { type: 'filter-operation', field: 'price', operation: 'lt', value: '200' },
    { type: 'group-end' },
    { type: 'group-end' },
];
