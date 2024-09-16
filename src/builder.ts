import * as qfilters from './types';

export class FilterBuilder {
    readonly grouperClass: new (options: qfilters.FilterGroupOptions) => qfilters.FilterGroup;
    root: qfilters.FilterGroup;
    activeGroup: qfilters.FilterGroup;

    constructor(
        grouperClass: new (options: qfilters.FilterSubgroupOptions) => qfilters.FilterGroup,
        opts: qfilters.FilterGroupOptions = {},
    ) {
        this.root = new grouperClass({
            isRoot: true,
            ...opts,
        });
        this.grouperClass = grouperClass;
        this.activeGroup = this.root;
    }

    addFilter(filter: qfilters.Filter): FilterBuilder {
        this.activeGroup.addFilter(filter);
        return this;
    }

    group(opts: qfilters.FilterSubgroupOptions | qfilters.FilterGroupOperator): FilterBuilder {
        if (typeof opts === 'string') {
            opts = { operator: opts };
        }

        const newGroup: qfilters.FilterGroup = new this.grouperClass(opts);
        this.activeGroup.addFilter(newGroup);
        this.activeGroup = newGroup;
        return this;
    }

    endGroup(): FilterBuilder {
        this.activeGroup = this.root;
        return this;
    }

    build(): string {
        return this.root.toString();
    }

    toString(): string {
        return this.build();
    }
}
