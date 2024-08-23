const pool = require('./db');
const inquirer = require('inquirer');
require('dotenv').config();

async function handleUserSelection(select) {
  try {
    let result;

    switch (select) {
      case "View All Departments":
        result = await pool.query("SELECT * FROM department");
        console.table(result.rows);
        break;

      case "View All Roles":
        result = await pool.query(`
          SELECT role.id, role.title, role.salary, department.name AS department
          FROM role
          JOIN department ON role.department_id = department.id
        `);
        console.table(result.rows);
        break;

      case "View All Employees":
        result = await pool.query(`
          SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department,
          role.salary AS salary, 
          CASE WHEN employee.manager_id IS NOT NULL THEN CONCAT(manager.first_name, ' ', manager.last_name) ELSE NULL END AS manager
          FROM employee
          JOIN role ON employee.role_id = role.id
          JOIN department ON role.department_id = department.id
          LEFT JOIN employee manager ON employee.manager_id = manager.id
        `);
        console.table(result.rows);
        break;

      case "Add a Department":
        const deptName = await inquirer.prompt([
          { name: "department", message: "Enter New Department Name:" },
        ]);
        await pool.query("INSERT INTO department (name) VALUES ($1)", [deptName.department]);
        console.log('Department added successfully.');
        break;

      case "Add a Role":
        const roleDetails = await inquirer.prompt([
          { name: "roleName", message: "Enter New Role Name:" },
          { name: "roleSalary", message: "Enter New Role Salary:" },
          { name: "roleDpt", message: "Enter New Role Department:" },
        ]);
        const deptResult = await pool.query("SELECT id FROM department WHERE name = $1", [roleDetails.roleDpt]);
        if (deptResult.rows.length === 0) {
          console.log("The department you entered doesn't exist. Please add the department first.");
          break;
        }
        await pool.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", 
          [roleDetails.roleName, roleDetails.roleSalary, deptResult.rows[0].id]);
        console.log('Role added successfully.');
        break;

      case "Add an Employee":
        const roles = await pool.query("SELECT * FROM role;");
        const availableManagers = await pool.query("SELECT * FROM employee WHERE manager_id IS NULL;");
        const employeeDetails = await inquirer.prompt([
          { name: "first_name", message: "Enter New Employee's First Name:" },
          { name: "last_name", message: "Enter New Employee's Last Name:" },
          { name: "role", message: "Enter New Employee's Role:" },
          { name: "manager", message: "Enter New Employee's Manager:" },
        ]);

        const roleData = roles.rows.find(r => r.title === employeeDetails.role);
        if (!roleData) {
          console.log("The role you entered doesn't exist. Please add the role first.");
          break;
        }

        const managerData = availableManagers.rows.find(m => `${m.first_name} ${m.last_name}` === employeeDetails.manager);
        if (!managerData && employeeDetails.manager !== 'None') {
          console.log("The manager you entered doesn't exist. Please select an existing manager or 'None' if the employee has no manager.");
          break;
        }

        await pool.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", 
          [employeeDetails.first_name, employeeDetails.last_name, roleData.id, managerData ? managerData.id : null]);
        console.log('Employee added successfully.');
        break;

      case "Update an Employee Role":
        const employees = await pool.query("SELECT id, first_name, last_name FROM employee;");
        const rolesForUpdate = await pool.query("SELECT id, title FROM role;");
        const updateDetails = await inquirer.prompt([
          { type: "list", name: "employeeId", message: "Choose Which Employee to Update:", choices: employees.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })) },
          { type: "list", name: "newRole", message: "Please Enter Employee's New Role:", choices: rolesForUpdate.rows.map(role => ({ name: role.title, value: role.id })) },
        ]);
        await pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", 
          [updateDetails.newRole, updateDetails.employeeId]);
        console.log('Employee role updated successfully.');
        break;

      case "Update Employee Manager":
        const employeesForManagerUpdate = await pool.query("SELECT id, first_name, last_name FROM employee;");
        const availableManagersForUpdate = await pool.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL;");
        
        const managerUpdateDetails = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Choose the employee whose manager you want to update:",
            choices: employeesForManagerUpdate.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
          },
          {
            type: "list",
            name: "newManagerId",
            message: "Choose the new manager:",
            choices: availableManagersForUpdate.rows.map(mgr => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id }))
          }
        ]);

        await pool.query("UPDATE employee SET manager_id = $1 WHERE id = $2", 
          [managerUpdateDetails.newManagerId, managerUpdateDetails.employeeId]);

        console.log('Employee manager updated successfully.');
        break;

      case "View Employees by Manager":
        const allManagers = await pool.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL;");
        
        const chosenManager = await inquirer.prompt([
          {
            type: "list",
            name: "managerId",
            message: "Choose a manager to see their employees:",
            choices: allManagers.rows.map(mgr => ({ name: `${mgr.first_name} ${mgr.last_name}`, value: mgr.id }))
          }
        ]);

        const employeesByManager = await pool.query("SELECT * FROM employee WHERE manager_id = $1", [chosenManager.managerId]);
        console.table(employeesByManager.rows);
        break;

      case "View Employees by Department":
        const departments = await pool.query("SELECT id, name FROM department;");
        
        const chosenDepartment = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Choose a department to see its employees:",
            choices: departments.rows.map(dept => ({ name: dept.name, value: dept.id }))
          }
        ]);

        const employeesByDepartment = await pool.query(`
          SELECT employee.id, employee.first_name, employee.last_name, role.title 
          FROM employee 
          JOIN role ON employee.role_id = role.id 
          WHERE role.department_id = $1`, [chosenDepartment.departmentId]);

        console.table(employeesByDepartment.rows);
        break;

      case "Delete Department":
        const departmentsToDelete = await pool.query("SELECT id, name FROM department;");
        
        const departmentToDelete = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Choose a department to delete:",
            choices: departmentsToDelete.rows.map(dept => ({ name: dept.name, value: dept.id }))
          }
        ]);

        await pool.query("DELETE FROM department WHERE id = $1", [departmentToDelete.departmentId]);
        console.log('Department deleted successfully.');
        break;

      case "Delete Role":
        const rolesToDelete = await pool.query("SELECT id, title FROM role;");
        
        const roleToDelete = await inquirer.prompt([
          {
            type: "list",
            name: "roleId",
            message: "Choose a role to delete:",
            choices: rolesToDelete.rows.map(role => ({ name: role.title, value: role.id }))
          }
        ]);

        await pool.query("DELETE FROM role WHERE id = $1", [roleToDelete.roleId]);
        console.log('Role deleted successfully.');
        break;

      case "Delete Employee":
        const employeesToDelete = await pool.query("SELECT id, first_name, last_name FROM employee;");
        
        const employeeToDelete = await inquirer.prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Choose an employee to delete:",
            choices: employeesToDelete.rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
          }
        ]);

        await pool.query("DELETE FROM employee WHERE id = $1", [employeeToDelete.employeeId]);
        console.log('Employee deleted successfully.');
        break;

      case "View Total Utilized Budget by Department":
        const departmentsForBudget = await pool.query("SELECT id, name FROM department;");
        
        const chosenDepartmentForBudget = await inquirer.prompt([
          {
            type: "list",
            name: "departmentId",
            message: "Choose a department to see its total utilized budget:",
            choices: departmentsForBudget.rows.map(dept => ({ name: dept.name, value: dept.id }))
          }
        ]);

        const totalBudget = await pool.query(`
          SELECT SUM(role.salary) AS total_budget 
          FROM employee 
          JOIN role ON employee.role_id = role.id 
          WHERE role.department_id = $1`, [chosenDepartmentForBudget.departmentId]);

        console.log(`Total Utilized Budget for Department: $${totalBudget.rows[0].total_budget}`);
        break;

      case "Quit":
        await pool.end();
        process.exit();
        break;

      default:
        console.log("Invalid selection.");
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

function userPrompt() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "select",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "Update Employee Manager",
          "View Employees by Manager",
          "View Employees by Department",
          "Delete Department",
          "Delete Role",
          "Delete Employee",
          "View Total Utilized Budget by Department",
          "Quit"
        ],
      },
    ])
    .then(async (res) => {
      await handleUserSelection(res.select);
      if (res.select !== "Quit") userPrompt();
    })
    .catch((err) => {
      console.log("Error:", err.message);
    });
}

userPrompt();
