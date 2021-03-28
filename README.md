## babel with ast

下面是 Babel 实现 AST 代码转换需要用到的包： 

```
// @babel/parser: 源代码 -> 语法树
// @babel/traverse: 遍历语法树
// @babel/types: 遍历语法树找到对应内容后，需要通过 types 去修改
// @babel/generator: 修改完语法树后，还原为源代码
```

具体实现：

```js
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const t = require('@babel/types')   // 转换节点类型
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
    // 处理 OK之后的内容写到语法树上
    path.node.body = [
      path.node.body = [t.returnStatement(t.binaryExpression('+', t.identifier('a'), t.identifier('b')))]
    ]
  }
})

// 3 将修改后的语法树代码重新变为可执行的代码
const newCode = generator(ast).code

console.log(newCode)
// 打印 
// function sum(a, b) {
//   return a + b;
// }
```