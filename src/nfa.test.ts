import { char, chars, and, or, kleene } from "./nfa"
import { test } from "./test"

test(
    char(/a/),
    [
        { action: /a/.source, offsets: [1] },
        { action: null, offsets: [] },
    ],
    "char test"
)

test(
    chars(/a/, /[0-9]/),
    [
        [{ action: /a/.source, offsets: [1] }, { action: null, offsets: [] }],
        [{ action: /[0-9]/.source, offsets: [1] }, { action: null, offsets: [] }],
    ],
    "chars test"
)

test(
    and(
        ...chars(/a/, /[0-9]/),
    ),
    [
        { action: /a/.source, offsets: [1] },
        { action: null, offsets: [1] },
        { action: /[0-9]/.source, offsets: [1] },
        { action: null, offsets: [] },
    ],
    "and test"
)

test(
    or(
        ...chars(/a/, /[0-9]/),
    ),
    [
        { action: null, offsets: [1, 3] },
        { action: /a/.source, offsets: [1] },
        { action: null, offsets: [3] },
        { action: /[0-9]/.source, offsets: [1] },
        { action: null, offsets: [1] },
        { action: null, offsets: [] },
    ],
    "or test"
)

test(
    kleene(
        char(/a/),
    ),
    [
        { action: null, offsets: [1, 3] },
        { action: /a/.source, offsets: [1] },
        { action: null, offsets: [-1, 1] },
        { action: null, offsets: [] },
    ],
    "kleene test"
)