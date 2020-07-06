import { char, chars, and, or, kleene } from "./nfa"
import { rule, Driver } from "./driver"

let driver = Driver(
    rule(
        "id",
        and(
            char(/[_a-zA-Z\u4E00-\u9FFF\uFF41-\uFF5A\uFF21-\uFF3A]/),
            kleene(
                char(/[0-9_a-zA-Z\u4E00-\u9FFF\uFF41-\uFF5A\uFF21-\uFF3A]/),
            ),
        ),
    ),
    rule(
        "space",
        kleene(
            char(/ /),
        ),
    ),
)
driver.reset()
driver.addCode("id _asd l2")
// while (true) {
//     driver.genToken()
// }