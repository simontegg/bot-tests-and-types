# JourneyBot

This repo is an example of using `http-compose` and `pull-stream` as the base for a chatbot architecture.


The application has one POST handler. POST requests from the chat platform (facebook messenger) are passed through a stack of middleware that perform logic checks on the request, the game status via the data base, mutating an in memory `context` object passed between middlewares.

```bash
git clone 
cd journeybot
yarn
```

## Static and runtime types in development

This repo also implements an unusual approach to type checks. Using `flow-jsdoc` to convert plain JavaScript annotated with shorthand types in coments into flow annotations, `flow`, to perform static type analysis, and `documentation` js to generate docs.


To see this in action run `npm run dev`. This will take a while the first time you run it. Then run `npm run dev-watch` and uncomment and save the code in `src/test-flow.js`


We can annotate the code in `src/` with `flow-jsdoc` shorthand:

```js
/**
 * accesses and transforms the actions map into array of action strings
 */
// : (Context) : string[]
function getActions (context) {
  return map(action => action)(context.actions)
}
```

The gulp task `annotate` transforms this into flow syntax and places it in the `flow/` directory:

```js
/**
 * maps through an object returning an array of action strings
 */

function getActions (context: Context) : string[] {
  return map(action => action)(context.actions)
}
```

The `watch` task runs our flow server using the type definition defined in `flow-typed/declarations.js` and installed with `flow-typed`. 

It also lints any changes and serves live docs on `localhost:4001` using `documentation` js. 

## Discussion

### Type definitions
Currently you have to define types in `flow-typed/declarations` in flow syntax **and** in the source file in jsdoc syntax if you want both static type checking and documentation. Ideally types would be defined in one place in one syntax. 

## Runtime type checking

The dream would be to also execute tests using `babel-preset-flow-tcomb` to transform flow into tcomb assertions and pick up runtime type errors. This would probably mean extending the `flow-jsdoc` module to handle flow type imports in comments. 

## What about Typescript?

Something lke this might be usful for type safety on an existing codebase or one where you want to execute code without a build step. For greenfield and/or client-side projects Typescript might be a better option as the IDE support is supposed to be excellent.  



