import { BooleanFilter, DateFilter, FilterGroup, NumberFilter, StringFilter } from './filters';
import * as qfilters from './types';

export class Parser implements qfilters.Parser {
    parse(tokens: qfilters.Token[], separator: string = ' '): qfilters.FilterGroup {
        const rootGroup = new FilterGroup({
            isRoot: true,
            separator,
        });
        const groupStack: qfilters.FilterGroup[] = [rootGroup];

        for (const token of tokens) {
            switch (token.type) {
                case qfilters.TokenType.GroupStart:
                    groupStack.push(new FilterGroup({ separator }));
                    break;
                case qfilters.TokenType.GroupEnd:
                    const completedGroup = groupStack.pop();
                    if (completedGroup && groupStack.length > 0) {
                        groupStack[groupStack.length - 1].filters.push(completedGroup);
                    }
                    break;
                case qfilters.TokenType.LogicalOperator:
                    groupStack[groupStack.length - 1].logicalOperator = token.value as qfilters.LogicalOperator;
                    break;
                case qfilters.TokenType.Filter:
                    // narrow-down the type, if you see this and you have a better solution
                    // please let me know
                    const t = token as qfilters.FilterToken;
                    const filter = this.createFilter(t.field, t.operator, t.value);
                    this.validateFilter(filter);
                    groupStack[groupStack.length - 1].filters.push(filter);
                    break;
                default:
                    throw new Error(`Unknown token type: ${JSON.stringify(token, null, 2)}`);
            }
        }

        return rootGroup;
    }

    private createFilter(field: string, operator: string, value: string): qfilters.Filter {
        if (value === 'true' || value === 'false') {
            return new BooleanFilter(field, operator, value === 'true');
        }

        if (!isNaN(Number(value))) {
            return new NumberFilter(field, operator, Number(value));
        }

        if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            return new DateFilter(field, operator, new Date(value));
        }

        return new StringFilter(field, operator, value);
    }

    private validateFilter(filter: qfilters.Filter): void {
        switch (filter.operator) {
            case 'eq':
            case 'ne':
                // These operators can be used with any type
                break;
            case 'gt':
            case 'gte':
            case 'lt':
            case 'lte':
                if (typeof filter.value !== 'number' && !(filter.value instanceof Date)) {
                    throw new Error(`Operator ${filter.operator} can only be used with numbers or dates`);
                }
                break;
            default:
                throw new Error(`Unknown operator: ${filter.operator}`);
        }

        if (typeof filter.value === 'string' && !filter.value.startsWith('"') && !filter.value.endsWith('"')) {
            throw new Error(`eq operator with string value requires quotes: ${filter.field}:eq:${filter.value}`);
        }
    }
}
