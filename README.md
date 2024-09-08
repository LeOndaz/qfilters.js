# qfilters

Handle filters with ease in query params. qfilters handles parsing params to objects you can work with.

The docs is not yet finished, but you can check the tests for now.
Extending the interface will be available once this reaches a stable version.
For now, all the interface is private till decided on a stable interface.

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

const query = 'name:eq:John';
const parsedQuery = parseQuery(query);
const serializedQuery = deserializeQuery(parsedQuery);

console.log(parsedQuery);
// {
//   field: 'name',
//   operator: 'eq',
//   value: 'John',
// }
```
