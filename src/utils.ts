import { Lexer } from './lexer';
import { Parser } from './parser';
import { FilterGroup } from './filters';

export const parseQuery = (query: string) => {
    const lexer = new Lexer();
    const tokens = lexer.tokenize(query);
    const parser = new Parser();
    return parser.parse(tokens);
};

export const deserializeQuery = (group: FilterGroup) => {
    return group.toString();
};

export const isOneOf = (char: string, chars: string[]) => {
    return chars.some((c) => c === char);
};
