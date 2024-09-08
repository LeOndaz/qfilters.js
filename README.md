# qfilters

Handle filters with ease in query params.

## Installation

```bash
npm install qfilters
```

or

```bash
yarn add qfilters
```

or

```bash
pnpm add qfilters
```

or

```bash
bun add qfilters
```

## Usage

```typescript
import { parseQuery, deserializeQuery } from 'qfilters';

const query = 'name:eq:John&age:gte:20&isActive:eq:true';
const parsedQuery = parseQuery(query);
const serializedQuery = deserializeQuery(parsedQuery);
```

Extending the interface will be available once this reaches a stable version.
For now, all the interface is private.
