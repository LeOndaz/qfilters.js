import * as qfilters from './types';

export class Lexer implements qfilters.Lexer {
    private readonly GROUP_START = '(';
    private readonly GROUP_END = ')';
    private readonly FILTER_SEPARATOR = ':';
    private readonly OPERATORS = ['and', 'or', 'eq', 'ne', 'gt', 'lt', 'gte', 'lte'];
    private input: string = '';
    private position: number = 0;

    lex(query: string | Record<string, string>): qfilters.Token[] {
        if (typeof query === 'string') {
            this.input = query;
            this.position = 0;
            return this.lexString();
        }

        return this.lexObject(query);
    }

    private peek(offset: number = 0): string {
        return this.input[this.position + offset] || '';
    }

    private lexString(): qfilters.Token[] {
        const tokens: qfilters.Token[] = [];

        while (this.position < this.input.length) {
            if (this.peek() === this.GROUP_START) {
                tokens.push(this.onGroupStart());
            } else if (this.peek() === this.GROUP_END) {
                tokens.push(this.onGroupEnd());
            } else if (/\s/.test(this.peek())) {
                this.onWhitespace();
            } else {
                tokens.push(this.onWord());
            }
        }

        return tokens;
    }

    private onGroupStart(): qfilters.Token {
        this.position++;
        return {
            type: qfilters.TokenType.GroupStart,
        };
    }

    private onGroupEnd(): qfilters.Token {
        this.position++;
        return { type: qfilters.TokenType.GroupEnd };
    }

    private onWhitespace(): void {
        while (this.position < this.input.length && /\s/.test(this.peek())) {
            this.position++;
        }
    }

    private onWord(): qfilters.Token {
        const word = this.readWord();

        if (this.isSupportedOperator(word)) {
            return this.onSupportedOperator(word);
        }
        return this.onFilter(word);
    }

    private readWord(): string {
        let word = '';
        let inQuotes = false;

        while (this.position < this.input.length) {
            const currentChar = this.peek();

            if (currentChar === '"') {
                inQuotes = !inQuotes;
                this.position++;
                continue;
            }

            if (!inQuotes && /[\s()]/.test(currentChar)) {
                break;
            }

            word += currentChar;
            this.position++;
        }

        return word;
    }

    private isSupportedOperator(word: string): boolean {
        return this.OPERATORS.includes(word.toLowerCase());
    }

    private onSupportedOperator(word: string): qfilters.LogicalOperatorToken {
        return { type: qfilters.TokenType.LogicalOperator, value: word.toLowerCase() as qfilters.LogicalOperator };
    }

    private onFilter(word: string): qfilters.Token {
        const [field, operator, ...valueParts] = word.split(this.FILTER_SEPARATOR);
        const value = valueParts.join(this.FILTER_SEPARATOR);

        return {
            type: qfilters.TokenType.Filter,
            field,
            operator,
            value,
        };
    }

    private lexObject(query: Record<string | 'filter', string>): qfilters.Token[] {
        return Object.entries(query).flatMap(([key, value]) => {
            if (key === 'filter') {
                this.input = value;
                this.position = 0;
                return this.lexString();
            }

            const [field, operator] = key.split(this.FILTER_SEPARATOR);
            return [{
                type: qfilters.TokenType.Filter,
                field,
                operator,
                value: this.removeQuotes(value),
            }];
        });
    }

    private removeQuotes(value: string): string {
        return value.replace(/^"|"$/g, '');
    }
}
