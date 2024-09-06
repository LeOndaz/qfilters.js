import * as qfilters from './types';

export class StringFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: string,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class NumberFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: number,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class BooleanFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: boolean,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class DateFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: Date,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value.toISOString()}`;
    }
}

export class FilterGroup implements qfilters.FilterGroup {
    readonly name?: string;
    readonly filters: (qfilters.Filter | qfilters.FilterGroup)[] = [];
    readonly separator: string = ' ';
    readonly isRoot: boolean = false;

    logicalOperator: qfilters.LogicalOperator;

    constructor({ name, logicalOperator = 'and', isRoot = false, separator = ' ' }: qfilters.FilterGroupOptions = {}) {
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

    subgroup(
        operatorOrOpts: Omit<qfilters.FilterGroupOptions, 'isRoot'> | qfilters.LogicalOperator = {},
    ): qfilters.FilterGroup {
        let subgroup: qfilters.FilterGroup;

        if (typeof operatorOrOpts === 'string') {
            subgroup = new FilterGroup({ logicalOperator: operatorOrOpts });
        } else {
            subgroup = new FilterGroup(operatorOrOpts);
        }

        this.filters.push(subgroup);
        return subgroup;
    }

    addFilter(filter: qfilters.Filter): void {
        this.filters.push(filter);
    }
}
