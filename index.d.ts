import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter } from './src/filters';
import { parseQuery, deserializeQuery } from './src/utils';

export * from './src/types';

export {
    Lexer,
    Parser,
    FilterGroup,
    StringFilter,
    NumberFilter,
    BooleanFilter,
    DateFilter,
    parseQuery,
    deserializeQuery,
};

export as namespace qfilters;

export declare const qfilters: {
    parseQuery: typeof parseQuery;
    deserializeQuery: typeof deserializeQuery;
};
