import { Request } from "./request"
import { UI } from "./ui"

// elementleri seçme
const form = document.getElementById("employee-form")
const nameInput = document.getElementById("name")
const departmentInput = document.getElementById("department")
const salaryInput = document.getElementById("salary")
const employeesList = document.getElementById("employees")
const updateEmployeeButton = document.getElementById("update")

const request = new Request("http://localhost:3000/employees")

const ui = new UI()

let updateState = null

addEventListener()

function addEventListener() {
    document.addEventListener("DOMContentLoaded", getAllEmployees)
    form.addEventListener("submit", addEmployee)
    employeesList.addEventListener("click", updateOrDelete)
    updateEmployeeButton.addEventListener("click", updateEmployee)
}

function getAllEmployees() {

    request.get()
        .then((employees) => {
            ui.addAllEmployeesToUI(employees)
        }).catch((err) => {
            console.log(err)
        });
}

function addEmployee(e) {
    const employeeName = nameInput.value.trim()
    const employeeDepartment = departmentInput.value.trim()
    const employeeSalary = salaryInput.value.trim()

    if (employeeName === "" || employeeDepartment === "" || employeeSalary === "") {
        alert("Lütfen tüm alanları doldurunuz.")
    }

    else {
        request.post({ name: employeeName, department: employeeDepartment, salary: Number(employeeSalary) })
            .then((employee) => {
                ui.addEmployeeToUI(employee)
            })
            .catch((err) => {
                console.log(err)
            });
    }

    ui.clearInput()
    e.preventDefault()
}

function updateOrDelete(e) {

    if (e.target.id === "delete-employee") {
        deleteEmployee(e.target)
    }
    else if (e.target.id === "update-employee") {
        updateEmployeeController(e.target.parentElement.parentElement)
    }

}

function deleteEmployee(targetEmploye) {
    const id = targetEmploye.parentElement.previousElementSibling.previousElementSibling.textContent

    request.delete(id)
        .then((message) => {
            ui.deleteEmployeeFromUI(targetEmploye.parentElement.parentElement)

        }).catch((err) => {
            console.log(err)
        });
}

function updateEmployeeController(targetEmployee) {
    ui.toggleUpdateButton(targetEmployee)
    if (updateState === null) {
        updateState = {
            updateId: targetEmployee.children[3].textContent,
            updateParent: targetEmployee
        }
    }
    else {
        updateState = null
    }
}

function updateEmployee() {
    if (updateState) {
        const data = {
            name: nameInput.value.trim(),
            department: departmentInput.value.trim(),
            salary: Number(salaryInput.value.trim())
        }
        request.put(updateState.updateId,data)
        .then((updateEmployee) => {
            ui.updateEmployeeOnUI(updateEmployee,updateState.updateParent)
        }).catch((err) => {
            console.log(err)
        });
    }
}



console.log(request)




// request.get()
// .then((employees) => {
//     console.log(employees)
// }).catch((err) => {
//     console.log(err)
// });


// request.post({name:"Saniye Çakmak",department:"Sağlık",salary:30.000})
// .then((response) => {
//        console.log(response)
// }).catch((err) => {
//     console.log(err)
// });

// request.put(1,{name:"utku bayraktaroğlu",department:"bilişim",salary:40000}).then((employee) => {
//     console.log(employee)
// }).catch((err) => {
//     console.log(err)
// });

// request.delete(3)
// .then((message) => {
//     console.log(message)
// })
// .catch((err) => {
//     console.log(err)
// });