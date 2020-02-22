class Model {
  constructor(schema) {
    this.data = {
      1: {
        id: 1,
        name: "Sample Input",
        description: "Description",
        priority: "1",
        complete: true,
        "due date": "2020-01-01"
      }
    };
    this.schema = schema;
    return this;
  }
  add(data) {
    this.validate(data);
    let record = this.serialize(data);
    this.data[record.id] = record;
    this.onChanged(this.data);
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
      Object.keys(data).forEach(key => {
        if ((this.schema[key] !== undefined) & (data[key] !== undefined)) {
          record[key] = data[key];
        }
      });
    }
    return record;
  }

  update(id, input) {
    let item = this.data[id];
    if (item) {
      let output = this.serialize(input, true, item);
      this.data[id] = output;
      this.onChanged(this.data);
      return output;
    }
  }
  delete(id) {
    let item = this.data[id];
    if (item) {
      delete this.data[id];
      this.onChanged(this.data);
    }
  }
  toggle(id) {
    let item = this.data[id];
    this.update(id, { complete: !item.complete });
  }
  getNextId() {
    return Object.keys(this.data).length + 1;
  }
  isDate(date) {
    return new Date(date) !== "Invalid Date" && !isNaN(new Date(date))
      ? true
      : false;
  }

  validate(data, raiseException = true) {
    let errors = {};
    return Object.keys(data).every(key => {
      if (typeof data[key] == this.schema[key].type || this.isDate(data[key])) {
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
  bindChanged(callback) {
    this.onChanged = callback;
  }
}
class View {
  constructor({ base, title, inputs }) {
    this.app = this.getElement(base);
    this.construct = inputs;
    this.createForm(title, inputs);

    // edit config
    this._temp;
    this._listeners();

    return this;
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
    this.inputs = [];
    inputs.fields.map(key => {
      this[key.name] = this.createElement(key.element);
      this.inputs.push(key.name);
      Object.keys(key).forEach(i => {
        if (i === "option") {
          Object.keys(key[i]).forEach(v => {
            let select = this.createElement(i);
            select.value = parseInt(v);
            select.text = key[i][v];
            this[key.name].append(select);
          });
        } else {
          this[key.name][i] = key[i];
        }
      });
      this[key.name].required = true;
      this.form.append(this[key.name]);
    });
    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";
    this.form.append(this.submitButton);
    this.todoItems = this.createElement("ul", "todo-list");
    this.app.append(this.title, this.form, this.todoItems);
    return this.app;
  }
  display(items) {
    // Delete all nodes
    while (this.todoItems.firstChild) {
      this.todoItems.removeChild(this.todoItems.firstChild);
    }
    if (Object.keys(items).length === 0) {
      let p = this.createElement("p");
      p.textContent = "Nothing to do! Add a task?";
      this.todoItems.append(p);
    } else {
      // Create todo item nodes for each todo in state
      Object.values(items)
        .sort((a, b) => {
          return new Date(b["due date"]) - new Date(a["due date"]);
        })
        .forEach(item => {
          const li = this.createElement("li");
          li.id = item.id;

          const checkbox = this.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = item.complete;

          const nameSpan = this.createElement("span");
          nameSpan.contentEditable = true;
          nameSpan.classList.add("editable");
          nameSpan.name = "name";

          const descriptionSpan = this.createElement("span");
          descriptionSpan.contentEditable = true;
          descriptionSpan.name = "description";
          descriptionSpan.classList.add("editable");

          // due date field
          let dueDateSpan = this.createElement("input");
          dueDateSpan.type = "date";
          dueDateSpan.id = "due";
          dueDateSpan.name = "due date";
          dueDateSpan.value = item["due date"];
          dueDateSpan.classList.add("editable");

          if (item.complete) {
            const strike = this.createElement("s");
            strike.textContent = item.name;

            const strike1 = this.createElement("s");
            strike1.textContent = item.description;

            nameSpan.append(strike);
            descriptionSpan.append(strike1);
          } else {
            nameSpan.textContent = item.name;
            descriptionSpan.textContent = item.description;
          }

          // priority level span
          let priority = this.priorityDot(item);

          // The delete button
          const deleteButton = this.createElement("button", "delete");
          deleteButton.textContent = "Delete";
          li.append(
            checkbox,
            nameSpan,
            descriptionSpan,
            dueDateSpan,
            priority,
            deleteButton
          );
          // Append nodes to the todo items
          this.todoItems.append(li);
        });
    }
  }
  priorityDot(item) {
    const color = {
      1: "#fc0f03",
      2: "#1e7d51",
      3: "cadetblue"
    };
    let priority = this.createElement("span");

    // tool tip text
    let text = this.createElement("span");
    text.classList.add("tool-tip-text");
    text.textContent = this.construct.fields[2].option[item.priority];
    priority.append(text);

    priority.classList.add("priority");
    priority.classList.add("tool-tip");
    priority.style["background-color"] = color[item.priority];
    return priority;
  }

  get _inputText() {
    let record = {};
    this.inputs.map(key => {
      record[key] = this[key].value;
    });
    return record;
  }
  _resetInput(name) {
    this.inputs.map(key => {
      this[key].value = "";
    });
  }
  bindAdd(handler) {
    this.form.addEventListener("submit", event => {
      event.preventDefault();
      if (this._inputText) {
        handler(this._inputText);
        this._resetInput();
      }
    });
  }

  bindDelete(handler) {
    this.todoItems.addEventListener("click", event => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }
  bindToggle(handler) {
    this.todoItems.addEventListener("change", event => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);
        handler(id);
      }
    });
  }
  _listeners() {
    this.todoItems.addEventListener("input", event => {
      if (event.target.className === "editable") {
        this._temp = event.target.innerText
          ? event.target.innerText
          : event.target.value;
      }
    });
  }
  bindEdit(handler) {
    this.todoItems.addEventListener("focusout", event => {
      if (this._temp) {
        const id = parseInt(event.target.parentElement.id);
        handler(id, { [event.target.name]: this._temp });
        this._temp = "";
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAdd(this.handleAdd);
    this.view.bindDelete(this.handleDelete);
    this.view.bindToggle(this.handleToggle);
    this.model.bindChanged(this.onChange);
    this.onChange(this.model.data);

    // edit config
    this.view.bindEdit(this.handleEdit);
  }

  onChange = items => {
    this.view.display(items);
  };
  handleAdd = todoText => {
    this.model.add(todoText);
  };
  handleEdit = (id, todoText) => {
    this.model.update(id, todoText);
  };
  handleDelete = id => {
    this.model.delete(id);
  };
  handleToggle = id => {
    this.model.toggle(id);
  };
}

schema = {
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

const view = new View(constructor);
const model = new Model(schema);

const app = new Controller(model, view);
