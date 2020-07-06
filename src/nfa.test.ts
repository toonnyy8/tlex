import { char, chars, and, or, kleene } from "./nfa"
import { test } from "./test"

test(
    char(/a/),
    [
        { action: /a/.source, offsets: [1] },
        { action: "", offsets: [] },
    ],
    "char test"
)

test(
    chars(/a/, /[0-9]/),
    [
        [{ action: /a/.source, offsets: [1] }, { action: "", offsets: [] }],
        [{ action: /[0-9]/.source, offsets: [1] }, { action: "", offsets: [] }],
    ],
    "chars test"
)

test(
    and(
        ...chars(/a/, /[0-9]/),
    ),
    [
        { action: /a/.source, offsets: [1] },
        { action: "", offsets: [1] },
        { action: /[0-9]/.source, offsets: [1] },
        { action: "", offsets: [] },
    ],
    "and test"
)

test(
    or(
        ...chars(/a/, /[0-9]/),
    ),
    [
        { action: "", offsets: [1, 3] },
        { action: /a/.source, offsets: [1] },
        { action: "", offsets: [3] },
        { action: /[0-9]/.source, offsets: [1] },
        { action: "", offsets: [1] },
        { action: "", offsets: [] },
    ],
    "or test"
)

test(
    kleene(
        char(/a/),
    ),
    [
        { action: "", offsets: [1, 3] },
        { action: /a/.source, offsets: [1] },
        { action: "", offsets: [-1, 1] },
        { action: "", offsets: [] },
    ],
    "kleene test"
)