import { Lexer } from './lexer';
import { Parser } from './parser';
import { FilterGroup } from './filters';

export const parseQuery = (query: string) => {
    const lexer = new Lexer();
    const tokens = lexer.lex(query);
    const parser = new Parser();
    return parser.parse(tokens);
};

export const deserializeQuery = (group: FilterGroup) => {
    return group.toString();
};
