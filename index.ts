// import {
//     parse,
//     tokenizer
// } from 'acorn'
import { 
    // CodeGen,
    Interpreter 
} from './src'
// type integer = 1 | 2;

// let a: integer = 1;

// console.log(a)

// console.log(parse("1 + 1", { ecmaVersion: 2020 }));
// console.log(...tokenizer("1 + 1", { ecmaVersion: 2020 }));

let interpretJsCode = `
console.log('=== MemberExpression evaluated =========');
function fn(){
    console.log('=== FunctionDeclaration evaluated =====')
}
fn()
`

// console.log(new CodeGen('console.log(1);').toCode());
console.log(new Interpreter(interpretJsCode).interpret());