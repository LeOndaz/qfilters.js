import { Lexer } from './src/lexer';
import { Parser } from './src/parser';
import { FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter } from './src/filters';

export const parseQuery = (query: string) => {
    const lexer = new Lexer();
    const tokens = lexer.lex(query);
    const parser = new Parser();
    return parser.parse(tokens);
};

export const deserializeQuery = (group: FilterGroup) => {
    return group.toString();
};

export { Lexer, Parser, FilterGroup, StringFilter, NumberFilter, BooleanFilter, DateFilter };

export default parseQuery;
