# Relay / GraphQL Notes List POC

> [relayjs / relay-starter-kit](https://github.com/relayjs/relay-starter-kit)

## Developing

Any changes you make to files in the `js/` directory will cause the server to
automatically rebuild the app and refresh your browser.

If at any time you make changes to `data/schema.js`, stop the server,
regenerate `data/schema.json`, and restart the server:

```
npm run update-schema
npm start
```

## Research

### GraphQL / Relay

- [Facebook GraphQL README](https://github.com/facebook/graphql/blob/master/README.md)
- [Relay - Homepage](https://facebook.github.io/relay/)
- [Relay - Getting Started](https://facebook.github.io/relay/docs/getting-started.html#content)
- [Relay - Tutorial](https://facebook.github.io/relay/docs/tutorial.html)
- [graphql / graphql-relay-js](https://github.com/graphql/graphql-relay-js)
- [Relay for Visual Learners](http://sgwilym.github.io/relay-visual-learners/)
- [Relay - Mutations](https://facebook.github.io/relay/docs/guides-mutations.html#content)
- [Relay TodoMVC with routing](https://github.com/taion/relay-todomvc)
- [Relay - relay-examples - TodoMVC](https://github.com/relayjs/relay-examples/tree/master/TodoMVC)
- [sogko / todomvc-relay-go](https://github.com/sogko/todomvc-relay-go)
- [Writing Simple Unit Tests with Relay](https://medium.com/@mikaelberg/writing-simple-unit-tests-with-relay-707f19e90129#.zgf3jzgx1)

### flexbox

- [CSS Tricks: A Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [MDN: Using CSS Flexible Boxes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Using_CSS_flexible_boxes)
- [A Visual Guide to CSS3 Flexbox Properties](https://scotch.io/tutorials/a-visual-guide-to-css3-flexbox-properties)
- [MDN: Advanced layouts with flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Advanced_layouts_with_flexbox)

## GraphQL Queries

### AddNewNote Mutation

```graphql
mutation AddNewNote($input: AddNoteInput!) {
  addNote(input: $input) {
    noteEdge {
      node {
        id,
        text
      }
    },
    viewer {
      id,
      name,
      totalCount,
      notes {
         edges {
          node {
            id,
            text,
            status
          }
        }
      }
    }
  }
}

# query variables

{
  "input": {
    "text": "Hello world"
  }
}
```

### RemoveAll Mutation

```graphql
mutation RemoveAll($_: RemoveAllNotesInput!) {
  removeAllNotes(input: $_) {
    viewer {
      id, name, totalCount
    }
  }
}

# query variables

{
  "_": {
    "clientMutationId": null
  }
}
```
