/* globals Chart:false, feather:false */

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

  function clearTable() {
    var table = document.getElementById("task-table-body")
    table.innerHTML = "";
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
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      datasets: [{
        data: [
          15339,
          21345,
          18483,
          24003,
          23489,
          24092,
          12034
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

})()

function deleteTask(element, id) {
  var row = element.parentNode.parentNode;

  return axios({
    method: 'delete',
    url: `https://trackableapi.azurewebsites.net/api/Tasks/${id}`,
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

function createTask(task) {

  return axios({
    method: 'post',
    url: `https://trackableapi.azurewebsites.net/api/Tasks`,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: task
  })
  .then(function (response) {
    // handle success
    clearTable()
    getTasks().then(function(response) {
      buildTable(response.data)
    })
  })
  
}

function getTasks(callbck) {
  return axios({
    method: 'get',
    url: 'https://trackableapi.azurewebsites.net/api/Tasks',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    }
  })
}