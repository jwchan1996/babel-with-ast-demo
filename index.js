const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')	// 转换节点类型
const generator = require('@babel/generator').default

const sourceCode = `function getUser() {}`

// 1 将字符串形式的代码处理为 AST 语法树
let ast = parser.parse(sourceCode)

// 2 遍历语法树，找到相应的节点内容，然后进行修改
traverse(ast, {
  // 进来之后我们需要找到想要的节点
  Identifier(path) {
    if (path.node.name == 'getUser') path.node.name = 'sum'
  },
  FunctionDeclaration(path) {
    path.node.params = [t.identifier('a'), t.identifier('b')]
  },
  BlockStatement(path) {
    path.node.body = [t.returnStatement(t.binaryExpression('+', t.identifier('a'), t.identifier('b')))]
  }
})

// 3 将修改后的语法树代码重新变为可执行的代码
const newCode = generator(ast).code

console.log(newCode)