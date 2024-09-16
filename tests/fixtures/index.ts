/* eslint-disable no-empty-pattern */

import { test as base } from 'vitest';
import { FilterGroup, Parser, Lexer } from '../../src';
import { Token } from '../../src/types';
import { groups, rootGroupTokens } from './groups';

interface Fixtures {
    groups: FilterGroup[];
    rootGroup: FilterGroup;
    rootGroupTokens: Token[];
    filterStrings: string[];
    tokens: Token[];
    lexer: Lexer;
    parser: Parser;
}

export const test = base.extend<Fixtures>({
    groups: [
        async ({}, use) => {
            await use(groups);
        },
        { auto: true },
    ],
    rootGroup: [
        async ({ groups }, use) => {
            await use(groups.find((group) => group.isRoot)!);
        },
        { auto: true },
    ],
    rootGroupTokens: [
        async ({}, use) => {
            await use(rootGroupTokens);
        },
        { auto: true },
    ],
    filterStrings: [
        async ({ groups }, use) => {
            await use(groups.map((group) => group.toString()));
        },
        { auto: true },
    ],
    tokens: [
        async ({ filterStrings, lexer }, use) => {
            const tokens = filterStrings.map((filterString) => lexer.tokenize(filterString)).flat();
            await use(tokens);
        },
        { auto: true },
    ],
    lexer: [
        async ({}, use) => {
            await use(new Lexer());
        },
        { auto: true },
    ],
    parser: [
        async ({}, use) => {
            await use(new Parser());
        },
        { auto: true },
    ],
});

test('', () => {});
