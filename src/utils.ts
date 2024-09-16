import { Lexer } from './lexer';
import { Parser } from './parser';
import { FilterGroup } from './filters';
import { FilterToken, GroupOperatorToken, Token } from './types';

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

export const isFilterToken = (token: Token): token is FilterToken => {
    return token.type === 'filter-operation';
};

export const isGroupOperatorToken = (token: Token): token is GroupOperatorToken => {
    return token.type === 'group-operator';
};