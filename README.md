# Coding Challenge for Voyagemobile
[Challenge instructions](https://www.notion.so/Coding-Challenge-f773e0ced5aa4620b357b7e730999612)

### How to run
```
$ yarn install
$ yarn start
```

### How to test
```
$ yarn test --watchAll
```

### Design desision
For this challenge I have used component/container pattern to split between ui-logic and business-logic. In different situation I'll rather use 'atomic design', but it will be overkill for such small task.

I don't like when there is 'index.ts' file for component, that exports necessary things, because it leads to duplicate declaration in namespaces, and IDEs autoimport are not always choose the best.

Although there was a requirement to use Context API for managing state, all "stateful" parts are close enought to pass data directly. But mockable service implementation are passed via context.
