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

