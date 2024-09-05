import * as QFilters from './types';

export class StringFilter implements QFilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: string,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class NumberFilter implements QFilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: number,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class BooleanFilter implements QFilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: boolean,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value}`;
    }
}

export class DateFilter implements QFilters.Filter {
    constructor(
        public field: string,
        public operator: string,
        public value: Date,
    ) {}

    toString(): string {
        return `${this.field}:${this.operator}:${this.value.toISOString()}`;
    }
}

export class FilterGroup implements QFilters.FilterGroup {
    readonly name?: string;
    readonly filters: (QFilters.Filter | QFilters.FilterGroup)[] = [];
    readonly separator: string = ' ';
    readonly isRoot: boolean = false;

    logicalOperator: QFilters.LogicalOperator;

    constructor({ name, logicalOperator = 'and', isRoot = false, separator = ' ' }: QFilters.FilterGroupOptions = {}) {
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
        operatorOrOpts: Omit<QFilters.FilterGroupOptions, 'isRoot'> | QFilters.LogicalOperator = {},
    ): QFilters.FilterGroup {
        let subgroup: QFilters.FilterGroup;

        if (typeof operatorOrOpts === 'string') {
            subgroup = new FilterGroup({ logicalOperator: operatorOrOpts });
        } else {
            subgroup = new FilterGroup(operatorOrOpts);
        }

        this.filters.push(subgroup);
        return subgroup;
    }

    addFilter(filter: QFilters.Filter): void {
        this.filters.push(filter);
    }
}
