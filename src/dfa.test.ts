import { char, chars, and, or, kleene } from "./nfa"
import { toDFA } from "./dfa"
import { test } from "./test"

test(
    toDFA(
        and(...chars(/i/, /i/))
    ),
    [
        { exit: false, links: [{ action: /i/.source, next: 1 }] },
        { exit: false, links: [{ action: /i/.source, next: 2 }] },
        { exit: true, links: [] },
    ],
    "dfa and test"
)

test(
    toDFA(
        or(...chars(/i/, /j/))
    ),
    [
        { exit: false, links: [{ action: /i/.source, next: 1 }, { action: /j/.source, next: 2 }] },
        { exit: true, links: [] },
        { exit: true, links: [] },
    ],
    "dfa or test1"
)

test(
    toDFA(
        or(...chars(/i/, /i/))
    ),
    [
        { exit: false, links: [{ action: /i/.source, next: 1 }] },
        { exit: true, links: [] },
    ],
    "dfa or test2"
)

test(
    toDFA(
        kleene(char(/i/))
    ),
    [
        { exit: true, links: [{ action: /i/.source, next: 1 }] },
        { exit: true, links: [{ action: /i/.source, next: 1 }] },
    ],
    "dfa kleene test"
)