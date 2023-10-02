import { parse, print, types, visit } from "recast";

const codeFile = Bun.file("./multiple-grouping-ordering-example.tsx");
const code = await codeFile.text();

console.log(code);

const ast = parse(code, {
  parser: require("recast/parsers/babylon"),
});

function identifyTwx(callExpressionNode: types.namedTypes.CallExpression) {
  let twxFound = false;
  types.visit(callExpressionNode, {
    visitIdentifier(path) {
      if (path.node.name === "twx") {
        twxFound = true;
      }
      return false;
    },
  });
  return twxFound;
}

function transformStringLiterals(
  arrayExpressionNode: types.namedTypes.ArrayExpression,
  key: string = "",
) {
  visit(arrayExpressionNode, {
    visitStringLiteral(path) {
      let result = path.node.value;
      if (key !== "") {
        result = `${key}:${path.node.value}`;
      }
      console.log(result);

      path.replace(types.builders.stringLiteral(result));
      this.traverse(path);
    },
  });
}

function transformProperty(
  objectPropertyNode: types.namedTypes.ObjectProperty,
  key: string = "",
) {
  let result!: types.namedTypes.ArrayExpression;
  types.visit(objectPropertyNode, {
    visitObjectProperty(path) {
      const appendKey = path.node.key;
      let resultKey!: string;
      if (appendKey.type === "StringLiteral") {
        if (key === "") {
          resultKey = `${appendKey.value}`;
        } else if (appendKey.value === "") {
          resultKey = `${key}`;
        } else if (key === "" && appendKey.value === "") {
          resultKey = "";
        } else {
          resultKey = `${key}:${appendKey.value}`;
        }
      } else if (appendKey.type === "Identifier") {
        if (key === "") {
          resultKey = `${appendKey.name}`;
        } else if (appendKey.name === "") {
          resultKey = `${key}`;
        } else if (key === "" && appendKey.name === "") {
          resultKey = "";
        } else {
          resultKey = `${key}:${appendKey.name}`;
        }
      }

      const value = path.node.value;
      if (value.type === "ArrayExpression") {
        transformStringLiterals(value, resultKey);
        result = value;
      } else if (value.type === "ObjectExpression") {
        result = transformTwxObjectNotation(value, resultKey);
      }
      return false;
    },
  });
  return result;
}

function transformTwxObjectNotation(
  objectExpressionNode: types.namedTypes.ObjectExpression,
  key: string = "",
) {
  const results: Array<types.namedTypes.ArrayExpression> = [];
  types.visit(objectExpressionNode, {
    visitObjectExpression(path) {
      for (const property of path.node.properties) {
        if (property.type === "ObjectProperty")
          results.push(transformProperty(property, key));
      }
      return false;
    },
  });

  return types.builders.arrayExpression(results);
}

function transformTwx(callExpressionNode: types.namedTypes.CallExpression) {
  let result!: types.namedTypes.CallExpression;
  types.visit(callExpressionNode, {
    visitCallExpression(path) {
      const node = path.node.arguments[0];
      if (node.type === "ObjectExpression") {
        const resultNode = transformTwxObjectNotation(node);
        result = types.builders.callExpression(
          types.builders.identifier("clsx"),
          [resultNode],
        );
      } else if (node.type === "ArrayExpression") {
        result = types.builders.callExpression(
          types.builders.identifier("clsx"),
          [node],
        );
      }
      return false;
    },
  });
  return result;
}

let twxCounter = 0;
types.visit(ast, {
  visitCallExpression(path) {
    if (identifyTwx(path.node)) {
      twxCounter += 1;
      const transformedNode = transformTwx(path.node);
      path.replace(transformedNode);
    }
    this.traverse(path);
  },
});

console.log(twxCounter);

const output = print(ast).code;

console.log(output);
