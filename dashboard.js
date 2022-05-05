/* globals Chart:false, feather:false */
const baseURL = "https://trackableapi.azurewebsites.net";
//const baseURL = "https://localhost:7259";

(function () {
  'use strict'

  feather.replace({ 'aria-hidden': 'true' })
  
  getTasks()
  .then(function (response) {
    buildTable(response.data)
  })

  function buildTable(data) {
    var table = document.getElementById("task-table-body")
    data.forEach((element, i) => {
      var row = table.insertRow(i)

      buildCell(0, row, element.id)
      buildCell(1, row, element.name)
      buildCell(2, row, element.message)
      buildCell(3, row, element.status)
      buildCell(4, row, element.type)
      buildCell(5, row, `<button type="button" class="btn btn-danger delete-btn" onclick="deleteTask(this, ${element.id})">Delete</button>`)

    });
  }

  function buildCell(i, row, text) {
    var cell = row.insertCell(i)
    cell.innerHTML = text
  }

  // Graphs
  var ctx = document.getElementById('myChart')
  // eslint-disable-next-line no-unused-vars
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [
        'October',
        'November',
        'December',
        'January',
        'February',
        'March',
        'April'
      ],
      datasets: [{
        data: [
          2,
          5,
          3,
          5,
          12,
          9,
          4
        ],
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: '#007bff',
        borderWidth: 4,
        pointBackgroundColor: '#007bff'
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: false
          }
        }]
      },
      legend: {
        display: false
      }
    }
  })

  var newTaskForm = document.getElementById("newTaskForm")

  newTaskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var name = document.getElementById("task-name").value
    var message = document.getElementById("message-text").value
    var status = document.getElementById("task-status").value
    var type = document.getElementById("task-type").value

    createTask({
      "Name": name,
      "Message": message,
      "Status": status,
      "Type": type,
      "Trace": ""
    })
  })

function createTask(newTask) {

  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  return (axios.post(`${baseURL}/api/Tasks`, newTask, { headers } )
  .then(function (response) {
    // handle success
    getTasks().then(function(response) {
      clearTable()
      buildTable(response.data)
      let modalEl = document.getElementById("createTaskModal")
      let modal = bootstrap.Modal.getInstance(modalEl)
      modal.hide()

      newTaskForm.reset()
    })
  }))
  
}

function getTasks() {
  return axios({
    method: 'get',
    url: `${baseURL}/api/Tasks`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  })
}

function clearTable() {
  var table = document.getElementById("task-table-body")
  table.innerHTML = "";
}

})()

function deleteTask(element, id) {
  var row = element.parentNode.parentNode;

  return axios({
    method: 'delete',
    url: `${baseURL}/api/Tasks/${id}`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  })
  .then(function (response) {
    // handle success
    row.remove();
  })
  
}