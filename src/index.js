var tasks = [
  {
    id: 1,
    name: "Sample Input",
    description: "Description",
    priority: 1
  }
];

var priority = {
  1: "LOW",
  2: "MEDIUM",
  3: "HIGH"
};

const getKeys = data => {
  return Object.keys(data[0]);
};

const getHeader = data => {
  let keys = getKeys(data);
  return keys.map(key => {
    return `<th key=${key}>${key.toUpperCase()}</th>`;
  });
};
const getRowsData = data => {
  let keys = getKeys(data);
  return data.map(row => {
    return `<tr>${Rows(row, keys)}</tr>`;
  });
};

const Rows = (task, keys) => {
  return keys.map((key, index) => {
    return `<td key=${index}>${task[key]}</td>`;
  });
};

const Table = data => {
  return `<div class="table-div"><table class="table table-striped table-bordered table-hover full-width"><thead><tr>${getHeader(
    data
  )}</tr></thead><tbody>${getRowsData(data)}</tbody></table></div>`;
};

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function load_table() {
  var page = document.getElementById("table");
  let table = createElementFromHTML(Table(tasks));
  page.append(table);
}
