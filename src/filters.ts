import * as types from './types';

export class StringFilter implements types.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: string,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class NumberFilter implements types.Filter {
    readonly type: string = 'number';

    constructor(
        public field: string,
        public operator: string,
        public value: number,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class BooleanFilter implements types.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: boolean,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class DateFilter implements types.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: Date,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value.toISOString()}`;
    }
}

export class FilterGroup implements types.FilterGroup {
    readonly name?: string;
    readonly filters: (types.Filter | types.FilterGroup)[] = [];
    readonly separator: string = ' ';
    readonly isRoot: boolean = false;

    logicalOperator: types.LogicalOperator;

    constructor({ name, logicalOperator = 'and', isRoot = false, separator = ' ' }: types.FilterGroupOptions = {}) {
        this.name = name;
        this.logicalOperator = logicalOperator;
        this.isRoot = isRoot;
        this.separator = separator;
    }

    toString(): string {
        const filters = this.filters.map((filter) => filter.toString());
        const separator = this.separator;
        const queryString = filters.join(`${separator}${this.logicalOperator.toUpperCase()}${separator}`);
        return this.filters.length > 1 && !this.isRoot ? `(${queryString})` : queryString;
    }

    subgroup(operatorOrOpts: Omit<types.FilterGroupOptions, 'isRoot'> | types.LogicalOperator = {}): types.FilterGroup {
        let subgroup: types.FilterGroup;

        if (typeof operatorOrOpts === 'string') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subgroup = new (this.constructor as any)({ logicalOperator: operatorOrOpts });
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            subgroup = new (this.constructor as any)(operatorOrOpts);
        }

        this.filters.push(subgroup);
        return subgroup;
    }

    addFilter(filter: types.Filter): void {
        this.filters.push(filter);
    }
}
