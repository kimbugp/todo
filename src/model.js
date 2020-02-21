class Model {
  constructor(schema) {
    this.data = {};
    this.schema = schema;
  }
  add(data) {
    this.validate(data);
    let record = this.serialize(data);
    this.data[record.id] = record;
    return record;
  }
  serialize(data, update = false, record = null) {
    if (!update) {
      record = {
        id: this.getNextId()
      };
      Object.keys(this.schema).forEach(key => {
        if (data[key] !== undefined) {
          record[key] = data[key];
        } else {
          record[key] = this.schema[key].default;
        }
      });
    } else {
      Object.keys(this.data).forEach(key => {
        if ((key in Object.keys(this.schema)) & (data[key] !== undefined)) {
          record[key] = data[key];
        }
      });
    }
    return record;
  }

  update(id, input) {
    let item = this.data[id];
    if (!item) {
      item = this.serialize(input, true, item);
      this.data[id] = item;
    }
    return this.data;
  }
  delete(id) {
    let item = this.data[id];
    if (item) {
      delete this.data[id];
    }
  }
  getNextId() {
    return Object.keys(this.data).length + 1;
  }

  validate(data, raiseException = true) {
    let errors = {};
    return Object.keys(data).every(key => {
      if (typeof data[key] == this.schema[key].type) {
        return true;
      } else {
        errors[key] = [
          `A valid ${this.schema[key].type} is required, ${typeof data[
            key
          ]} supplied`
        ];
      }
      if (raiseException) {
        throw new Error(JSON.stringify(errors));
      }
      return errors;
    });
  }
}
class Manipulator {
  constructor({ base, title, inputs }) {
    this.app = this.getElement(base);
    this.createForm(title, inputs);
    return this.app;
  }
  createElement(tag, className) {
    let element = document.createElement(tag);
    if (className) {
      element.classList.add(className);
    }
    return element;
  }
  getElement(selector) {
    let element = document.querySelector(selector);
    return element;
  }
  createForm(title, inputs) {
    this.title = this.createElement(title.tag);
    this.title.textContent = title.text;

    this.form = this.createElement("form");
    inputs.fields.map(key => {
      this[key.name] = this.createElement(key.element);
      Object.keys(key).forEach(i => {
        if (i === "option") {
          Object.keys(key[i]).forEach((v, index) => {
            let select = this.createElement(i);
            select.value = index;
            select.text = key[i][v];
            this[key.name].append(select);
          });
        } else {
          this[key.name][i] = key[i];
        }
      });
      this.form.append(this[key.name]);
    });
    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";
    this.form.append(this.submitButton);
    this.todoList = this.createElement("ul", "todo-list");
    this.app.append(this.title, this.form, this.todoList);
    return this.app;
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

schema = {
  name: {
    type: "string"
  },
  description: {
    type: "string"
  },
  priority: {
    type: "number"
  },
  done: {
    type: "boolean",
    default: false
  }
};

const model = new Model(schema);
data = {
  name: "Sample Input",
  description: "Description",
  priority: 1
};

constructor = {
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
        placeholder: "description",
        name: "description"
      },
      {
        element: "select",
        placeholder: "Add name here",
        name: "priority",
        option: {
          1: "LOW",
          2: "MEDIUM",
          3: "HIGH"
        }
      }
    ]
  }
};

const view = new Manipulator(constructor);
// console.log(view);
