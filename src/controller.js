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
