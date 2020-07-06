import "../src/nfa.test"
import "../src/internal/dfa.test"
import "../src/driver.test"

import * as tlex from "../src"

let driver = tlex.Driver(
    tlex.rule(
        "[let]",
        tlex.and(...tlex.chars(/l/, /e/, /t/,)),
    ),
    tlex.rule(
        "[id]",
        tlex.and(
            tlex.char(/[a-zA-Z\u4E00-\u9FFF\uFF41-\uFF5A\uFF21-\uFF3A_]/),
            tlex.kleene(tlex.char(/[a-zA-Z\u4E00-\u9FFF\uFF41-\uFF5A\uFF21-\uFF3A_0-9]/)),
        ),
    ),
    tlex.rule(
        "[space]",
        tlex.and(
            tlex.char(/[ \t]/),
            tlex.kleene(tlex.char(/[ \t]/)),
        )
    ),
    tlex.rule(
        "[comment]",
        tlex.and(
            ...tlex.chars(/[/]/, /[/]/),
            tlex.kleene(tlex.char(/./)),
        ),
    ),
)
