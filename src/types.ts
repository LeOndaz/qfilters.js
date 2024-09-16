export interface Filter {
    toString(): string;

    operation: string;
    field: string;
    value: unknown;
}

export interface NumberFilter extends Filter {
    value: number;
}

export interface StringFilter extends Filter {
    value: string;
}

export interface BooleanFilter extends Filter {
    value: boolean;
}

export type TokenType = 'group-start' | 'group-end' | 'filter-operation' | 'group-operator' | 'filter' | 'illegal';

export interface BaseToken {
    type: TokenType;
    position?: number; // TODO: Remove this
}

export interface GroupStartToken extends BaseToken {
    type: 'group-start';
}

export interface GroupEndToken extends BaseToken {
    type: 'group-end';
}

export interface IllegalToken extends BaseToken {
    type: 'illegal';
    value: string;
}

export interface GroupOperatorToken extends BaseToken {
    type: 'group-operator';
    operator: FilterGroupOperator;
}

export interface FilterToken extends BaseToken {
    type: 'filter-operation';
    field: string;
    operation: FilterOperation;
    value: string;
}

export type Token = GroupStartToken | GroupEndToken | GroupOperatorToken | FilterToken | IllegalToken;

export interface Lexer {
    tokenize(query: string): Token[];
}

export interface FilterGroupOptions {
    name?: string;
    isRoot?: boolean;
    operator?: FilterGroupOperator;
}

export type FilterSubgroupOptions = Omit<FilterGroupOptions, 'isRoot'>;

export type FilterString = `${string}:${FilterOperation}:${string}`;
export type FilterOperation =
    | 'and'
    | 'or'
    | 'eq'
    | 'neq'
    | 'lt'
    | 'lte'
    | 'gt'
    | 'gte'
    | 'in'
    | 'nin'
    | 'regex'
    | string;
export type FilterGroupOperator = '&' | '|';

export interface FilterGroup {
    readonly filters: (Filter | FilterGroup)[];
    readonly isRoot: boolean;
    operator: FilterGroupOperator;
    addFilter(filter: Filter | FilterGroup): void;
    subgroup(operator: FilterGroupOperator): FilterGroup;
    subgroup(opts: FilterSubgroupOptions): FilterGroup;
    toString(): string;
}

export interface ILexer {
    lex(query: string | Record<string, string>): Token[];
}

export interface Parser {
    parse(tokens: Token[]): FilterGroup;
}
