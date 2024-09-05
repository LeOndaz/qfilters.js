import * as QFilters from './types';

export class FilterBuilder {
    readonly separator: string = ' ';

    readonly grouperClass: new (options: QFilters.FilterGroupOptions) => QFilters.FilterGroup;
    readonly root: QFilters.FilterGroup;
    readonly stack: QFilters.FilterGroup[] = [];

    constructor(
        grouperClass: new (options: QFilters.FilterSubgroupOptions) => QFilters.FilterGroup,
        opts: QFilters.FilterGroupOptions = {},
    ) {
        this.root = new grouperClass({
            isRoot: true,
            ...opts,
        });
        this.grouperClass = grouperClass;
        this.stack.push(this.root);
    }

    private get currentGroup(): QFilters.FilterGroup {
        return this.stack[this.stack.length - 1];
    }

    addFilter(filter: QFilters.Filter): FilterBuilder {
        this.currentGroup.filters.push(filter);
        return this;
    }

    group(opts: QFilters.FilterSubgroupOptions | QFilters.LogicalOperator): FilterBuilder {
        if (typeof opts === 'string') {
            opts = { logicalOperator: opts };
        }

        const newGroup: QFilters.FilterGroup = new this.grouperClass(opts);
        this.stack.push(newGroup);
        return this;
    }

    endGroup(): FilterBuilder {
        if (this.stack.length > 1) {
            const completedGroup = this.stack.pop()!;
            this.currentGroup.filters.push(completedGroup);
        }
        return this;
    }

    build(): string {
        return this.root.toString();
    }
}
