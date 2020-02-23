const Schema = {
  name: {
    type: "string"
  },
  complete: {
    type: "boolean"
  },
  description: {
    type: "string"
  },
  priority: {
    type: "string"
  },
  done: {
    type: "boolean",
    default: false
  },
  "due date": {
    type: "date",
    default: "2020-01-01"
  }
};

const Constructor = {
  base: "#root",
  title: {
    tag: "h1",
    text: "Todo app"
  },
  inputs: {
    fields: [
      {
        type: "text",
        element: "input",
        placeholder: "Add name here",
        name: "name"
      },
      {
        type: "text",
        element: "input",
        placeholder: "Description",
        name: "description"
      },
      {
        element: "select",
        name: "priority",
        option: {
          1: "HIGH",
          2: "MEDIUM",
          3: "LOW"
        }
      },
      {
        type: "date",
        element: "input",
        name: "due date",
        value: "2020-01-01"
      }
    ]
  }
};
