import { Context } from '@/environment/context'
import ESTree from 'estree'
import { NodeTypes } from './ast';
import { BinaryExpression, dispatchExpression } from './expression';
import { Tree } from './Tree'
import { ExpressionStatement } from './expression'
import { VariableDeclaration } from './VariableDeclaration'


export class BlockStatement extends Tree {
    ast!: ESTree.BlockStatement
    constructor(ast: ESTree.BlockStatement) {
        super(ast)
    }
    toCode(): string {// Todos: finish function toCode
        return ''
    }

    evaluate(context: Context): boolean {
        return this.ast.body.every((statement: ESTree.Statement) => dispatchStatement(statement, context))
    }
}
export class ReturnStatement extends Tree {
    ast!: ESTree.ReturnStatement;
    constructor(ast: ESTree.ReturnStatement) {
        super(ast)
    }

    evaluate(context: Context): false {
        if (this.ast.argument) {
            let result = dispatchExpression(this.ast.argument, context)
            context.env.setReturnValue(result)
        }

        return false
    }
}

export class WhileStatement extends Tree {
    ast!: ESTree.WhileStatement;
    constructor(ast: ESTree.WhileStatement) {
        super(ast)
    }

    evaluate(context: Context): boolean {
        if (this.ast.test.type === NodeTypes.BinaryExpression) {
            let binaryExpression = new BinaryExpression(this.ast.test);

            while (binaryExpression.evaluate(context)) {
                if (this.ast.body.type === NodeTypes.BlockStatement) {
                    return new BlockStatement(this.ast.body).evaluate(context)
                }
            }
        }
        return true
    }
}
export class IfStatement extends Tree {
    ast!: ESTree.IfStatement;
    constructor(ast: ESTree.IfStatement) {
        super(ast)
    }

    evaluate(context: Context): boolean {
        if (this.ast.test.type === NodeTypes.BinaryExpression) {
            let binaryExpression = new BinaryExpression(this.ast.test);
            if (binaryExpression.evaluate(context)) {
                if (this.ast.consequent.type === NodeTypes.BlockStatement) {
                    return new BlockStatement(this.ast.consequent).evaluate(context)
                }
            } else {
                if (this.ast.alternate) {
                    if (this.ast.alternate.type === NodeTypes.BlockStatement) {
                        return new BlockStatement(this.ast.alternate).evaluate(context)
                    }
                }
            }
        }

        return true
    }
}

/**
 * statement which contains blockStatement evaluate should return boolean 
 * to skip latter evaluation when encounter return interruption
 */

function dispatchStatement(statement: ESTree.Statement, context: Context): boolean {
    if (statement.type === NodeTypes.ExpressionStatement) {
        new ExpressionStatement(statement).evaluate(context)
    } else if (statement.type === NodeTypes.VariableDeclaration) {
        new VariableDeclaration(statement).evaluate(context)
    } else if (statement.type === NodeTypes.WhileStatement) {
        return new WhileStatement(statement).evaluate(context)
    } else if (statement.type === NodeTypes.IfStatement) {
        return new IfStatement(statement).evaluate(context)
    } else if (statement.type === NodeTypes.ReturnStatement) {
        /**
         * interrupt when encounter returnStatement
         */
        return new ReturnStatement(statement).evaluate(context)
    } else {
        throw Error('Unknown statement ' + statement)
    }

    return true;
}
