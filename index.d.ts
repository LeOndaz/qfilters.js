import { Lexer } from './lib';
import { Parser } from './lib';
import { FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter } from './lib';
import { parseQuery, deserializeQuery } from './lib';

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

declare const qfilters: {
    parseQuery: typeof parseQuery;
    deserializeQuery: typeof deserializeQuery;
};

export default qfilters;