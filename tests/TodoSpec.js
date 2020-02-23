describe("Test todo app", () => {
  it("should add an item", () => {
    const view = new View(constructor);
    const model = new Model(schema);

    const app = new Controller(model, view);
    let app = new app();
    let item = {
      title: "get milk",
      complete: false
    };
    const done = todo.addTodo(item);
    expect(todo.getItems().length).toBe(1);
  });
});
