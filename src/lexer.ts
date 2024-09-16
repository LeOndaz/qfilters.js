import * as qfilters from './types';

export class Lexer implements qfilters.Lexer {
    protected readonly GROUP_START = '(';
    protected readonly GROUP_END = ')';
    protected readonly FILTER_SEPARATOR = ':';
    protected readonly SPECIAL_CHARACTERS = [this.GROUP_START, this.GROUP_END, '&', '|', this.FILTER_SEPARATOR];
    protected readonly FILTER_OPERATION = [
        'and',
        'or',
        'eq',
        'ne',
        'neq',
        'gt',
        'lt',
        'gte',
        'lte',
        'in',
        'nin',
        'regex',
    ];

    protected input: string = '';
    protected position: number = 0;
    protected tokens: qfilters.Token[] = [];

    protected isSpecialCharacter = (char: string) => {
        return this.SPECIAL_CHARACTERS.includes(char);
    };

    protected isFilterOperation = (char: string) => {
        return this.FILTER_OPERATION.includes(char);
    };

    protected peek(offset: number = 0): string {
        return this.input[this.position + offset] || '';
    }

    protected step(offset: number = 1): void {
        this.position += offset;
    }

    protected reset(query?: string): void {
        this.position = 0;
        this.tokens = [];
        this.input = query || '';
    }

    protected isSupportedCharacter(char: string): boolean {
        const regex = `[a-zA-Z0-9_"${this.SPECIAL_CHARACTERS.join('')}]`;
        return new RegExp(regex).test(char);
    }

    public tokenize(query: string): qfilters.Token[] {
        this.reset(query);

        while (this.position < this.input.length) {
            const char = this.peek();

            if (!this.isSupportedCharacter(char)) {
                this.tokens.push({ type: 'illegal', value: char });
                this.step();
                continue;
            }

            if (this.isSpecialCharacter(char)) {
                this.tokenizeSpecialChar(char);
                this.step();
                continue;
            }

            if (/\s/.test(char)) {
                this.step();
                continue;
            }

            this.assumeFilterString();
        }

        return this.tokens;
    }

    protected tokenizeSpecialChar(value: string): void {
        if (value === this.GROUP_START) {
            this.tokens.push({ type: 'group-start' });
            return;
        }

        if (value === this.GROUP_END) {
            this.tokens.push({ type: 'group-end' });
            return;
        }

        if (value === '&') {
            this.tokens.push({ type: 'group-operator', operator: '&' });
            return;
        }

        if (value === '|') {
            this.tokens.push({ type: 'group-operator', operator: '|' });
            return;
        }

        // shouldn't tokenize filter separator
    }

    protected readWord(): string {
        const letters = [];
        let done = false;

        while (!done) {
            const char = this.peek();

            if (this.isSpecialCharacter(char)) {
                done = true;
                break;
            }

            this.step();
            letters.push(char);
        }

        return letters.join('');
    }

    protected cleanOperationValue(value: string): string {
        return value.replace(/"/g, '');
    }

    protected assumeFilterString(): void {
        const field = this.readWord();
        this.step();
        const operation = this.readWord();
        this.step();
        const rawValue = this.readWord();
        const value = this.cleanOperationValue(rawValue);

        this.tokens.push({
            type: 'filter-operation',
            field,
            operation,
            value,
        });
    }
}
