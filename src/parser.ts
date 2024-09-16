import { BooleanFilter, DateFilter, FilterGroup, NumberFilter, StringFilter } from './filters';
import * as qfilters from './types';
import { isFilterToken, isGroupOperatorToken } from './utils';

export class Parser implements qfilters.Parser {
    parse(tokens: qfilters.Token[]): qfilters.FilterGroup {
        const rootGroup = new FilterGroup({ isRoot:true})
        const groupStack: FilterGroup[] = [rootGroup];

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];

            if (token.type === 'group-start') {
                if (i !== 0) {
                    const newGroup = new FilterGroup();
                    groupStack[groupStack.length - 1].addFilter(newGroup);
                    groupStack.push(newGroup)
                    continue;
                }
                groupStack.push(rootGroup);
                continue;
            }

            if (token.type === 'group-end') {
                groupStack.pop();
                continue;
            }

            if (isGroupOperatorToken(token)) {
                groupStack[groupStack.length - 1].operator = token.operator;
                continue;
            }

            if (isFilterToken(token)) {
                const filter = this.createFilter(token.field, token.operation, token.value);
                this.validateFilter(filter);
                groupStack[groupStack.length - 1].addFilter(filter);
                continue;
            }

            throw new Error(`Unknown token type: ${JSON.stringify(token, null, 2)}`);
        }

        if (groupStack.length !== 1) {
            throw new Error('Mismatched group parentheses');
        }

        return groupStack[0];
    }

    protected createFilter(field: string, operator: string, value: string): qfilters.Filter {
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
        switch (filter.operation) {
            case 'eq':
            case 'ne':
                // These operators can be used with any type
                break;
            case 'gt':
            case 'gte':
            case 'lt':
            case 'lte':
                if (typeof filter.value !== 'number' && !(filter.value instanceof Date)) {
                    throw new Error(`operator ${filter.operation} can only be used with numbers or dates`);
                }
                break;
            default:
                throw new Error(`Unknown operator: ${filter.operation}`);
        }
    }
}
