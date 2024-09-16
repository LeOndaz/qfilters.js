import * as qfilters from './types';

export class CompositeFilter implements qfilters.Filter {
    public operation: string = 'composite';
    public field: string;
    public value: { [operator: string]: unknown };

    constructor(field: string, conditions: { [operator: string]: unknown }) {
        this.field = field;
        this.value = conditions;
    }

    toString(): string {
        const conditionStrings = Object.entries(this.value).map(
            ([operator, value]) => `${operator.substring(1)}:${value}`,
        );
        return `${this.field}:(${conditionStrings.join('&')})`;
    }
}

export class StringFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operation: string,
        public value: string,
    ) {}

    toString(): string {
        return `${this.field}:${this.operation}:${this.value}`;
    }
}

export class NumberFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operation: string,
        public value: number,
    ) {}

    toString(): string {
        return `${this.field}:${this.operation}:${this.value}`;
    }
}

export class BooleanFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operation: string,
        public value: boolean,
    ) {}

    toString(): string {
        return `${this.field}:${this.operation}:${this.value}`;
    }
}

export class DateFilter implements qfilters.Filter {
    constructor(
        public field: string,
        public operation: string,
        public value: Date,
    ) {}

    toString(): string {
        return `${this.field}:${this.operation}:${this.value.toISOString()}`;
    }
}

export class FilterGroup implements qfilters.FilterGroup {
    readonly name?: string;
    readonly filters: (qfilters.Filter | qfilters.FilterGroup)[] = [];
    readonly isRoot: boolean = false;

    operator: qfilters.FilterGroupOperator;

    constructor({ name, operator = '&', isRoot = false }: qfilters.FilterGroupOptions = {}) {
        this.name = name;
        this.operator = operator;
        this.isRoot = isRoot;
    }

    toString(): string {
        const filters = this.filters.map((filter) => filter.toString());
        const queryString = filters.join(this.operator.toUpperCase());

        return this.filters.length > 1 && !this.isRoot ? `(${queryString})` : queryString;
    }

    subgroup(
        operatorOrOpts: Omit<qfilters.FilterGroupOptions, 'isRoot'> | qfilters.FilterGroupOperator = {},
    ): qfilters.FilterGroup {
        let subgroup: qfilters.FilterGroup;

        if (typeof operatorOrOpts === 'string') {
            subgroup = new FilterGroup({ operator: operatorOrOpts });
        } else {
            subgroup = new FilterGroup(operatorOrOpts);
        }

        this.addFilter(subgroup);
        return subgroup;
    }

    addFilter(filter: qfilters.Filter | qfilters.FilterGroup): void {
        this.filters.push(filter);
    }
}
