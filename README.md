# qfilters

Handle filters with ease in query params. qfilters handles parsing params to objects you can work with.

The docs is not yet finished, but you can check the tests for now.
Extending the interface will be available once this reaches a stable version.
For this specific reason, the interface extension is blocked and each method is private.

## Installation

You'll need to install the package with git, since it's not published yet.

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
