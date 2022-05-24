# mockdown-client

## What is this?

A JavaScript module (written in TypeScript) for interfacing with the mockdown
server interface, plus some utilities for working with constraints
as well as Cassowary (`kiwi.js`).

## How do I install it?

First, compile it:

> yarn build // or npm run build

Then link it:

> yarn link // or npm link

And finally, in any project you want to use your copy of this package:

> yarn link mockdown-client // or npm link mockdown-client

(Instructions are more or less the same if you use `npm link`.)

## How do I use it?

### How do I get some constraints for my examples?

If you have examples such as:

```typescript
const examples = [
    {
        "name": "p",
        "rect": [0, 0, 100, 100],
        "children": [/*...*/]
    },
    // ...
]
```

Then you can just:

```typescript
import { MockdownClient } from 'mockdown-client';

const example1 = {"name": "authors",
    "rect": [0, 500, 1200, 870],
    "children": [{
        "name": "turing",
        "rect": [59.5, 582, 400, 840]
        },
        {
        "name": "hopper",
        "rect": [430, 582, 770, 840]
        },
    ]}

const example2 = {"name": "authors",
    "rect": [0, 500, 1600, 870],
    "children": [{
        "name": "turing",
        "rect": [60.15, 582, 533.33, 840]
        },
        {
        "name": "hopper",
        "rect": [563.33, 582, 1036.66, 840]
        },
    ]}

const examples = [example1, example2]
const client = new MockdownClient("0.0.0.0", 8000)
const constraints = await client.fetch(examples, {learningMethod: 'noisetolerant', width: {lower:1200, upper:1600}, height: {lower:500, upper:500}})
console.log(constraints)
```
