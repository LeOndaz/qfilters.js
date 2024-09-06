import * as qfilters from './types';

export class FilterBuilder {
    readonly separator: string = ' ';

    readonly grouperClass: new (options: qfilters.FilterGroupOptions) => qfilters.FilterGroup;
    readonly root: qfilters.FilterGroup;
    readonly stack: qfilters.FilterGroup[] = [];

    constructor(
        grouperClass: new (options: qfilters.FilterSubgroupOptions) => qfilters.FilterGroup,
        opts: qfilters.FilterGroupOptions = {},
    ) {
        this.root = new grouperClass({
            isRoot: true,
            ...opts,
        });
        this.grouperClass = grouperClass;
        this.stack.push(this.root);
    }

    private get currentGroup(): qfilters.FilterGroup {
        return this.stack[this.stack.length - 1];
    }

    addFilter(filter: qfilters.Filter): FilterBuilder {
        this.currentGroup.filters.push(filter);
        return this;
    }

    group(opts: qfilters.FilterSubgroupOptions | qfilters.LogicalOperator): FilterBuilder {
        if (typeof opts === 'string') {
            opts = { logicalOperator: opts };
        }

        const newGroup: qfilters.FilterGroup = new this.grouperClass(opts);
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
