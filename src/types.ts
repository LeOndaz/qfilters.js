// export interface Filter {
//     toString(): string;
//     operator: string;
//     field: string;
//     value: unknown;
// }

// export enum TokenType {
//     GroupStart,
//     GroupEnd,
//     LogicalOperator,
//     Filter,
// }

// export interface GroupStartToken {
//     type: TokenType.GroupStart;
//     value?: never;
//     field?: never;
//     operator?: never;
// }

// export interface GroupEndToken {
//     type: TokenType.GroupEnd;
//     value?: never;
//     field?: never;
//     operator?: never;
// }

// export interface LogicalOperatorToken {
//     type: TokenType.LogicalOperator;
//     value: string;
//     field?: never;
//     operator?: LogicalOperator;
// }

// export interface FilterToken {
//     type: TokenType.Filter;
//     value: string;
//     field: string;
//     operator: string;
// }

// export type Token = GroupStartToken | GroupEndToken | LogicalOperatorToken | FilterToken;

// export interface Lexer {
//     lex(query: string | Record<string, string>): Token[];
// }

// export interface FilterGroupOptions {
//     name?: string;
//     separator?: string;
//     isRoot?: boolean;
//     logicalOperator?: LogicalOperator;
// }

// export type FilterSubgroupOptions = Omit<FilterGroupOptions, 'isRoot'>;

// export type LogicalOperator = 'and' | 'or';

// export interface FilterGroup {
//     readonly filters: (Filter | FilterGroup)[];
//     readonly separator: string;
//     readonly isRoot: boolean;
//     logicalOperator: LogicalOperator;
//     addFilter(filter: Filter): void;
//     subgroup(opts: FilterSubgroupOptions | LogicalOperator): FilterGroup;
//     toString(): string;
// }

// export interface ILexer {
//     lex(query: string | Record<string, string>): Token[];
// }

// export interface Parser {
//     parse(tokens: Token[]): FilterGroup;
// }
