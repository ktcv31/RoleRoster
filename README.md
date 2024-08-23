# RoleRoster
Role Roster is a command-line application that manages a company's employee database. It allows users to view and manage departments, roles, and employees, making it easier to organize and plan the business. The application is built using Node.js, Inquirer, and PostgreSQL.

-Installation
Clone the repository:
git clone https://github.com/ktcv31/RoleRoster

-Navigate to the project directory:
(cd RoleRoster)

-Install the necessary dependencies:
(npm install)

-Set up your PostgreSQL database:

-Create a database named roleroster:
   Run the schema.sql file to create the necessary tables:
(psql -U postgres -d roleroster -h localhost -p 5432 -f schema.sql)

-Create a .env file in the root directory and configure your database connection:
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=roleroster
DB_PORT=5432

-Usage
  To start the application, run the following command:
(node index.js)

You will be presented with the following options:

View All Departments
View All Roles
View All Employees
Add a Department
Add a Role
Add an Employee
Update an Employee Role
View Employees by Manager
View Employees by Department
Delete Departments, Roles, and Employees
View Total Utilized Budget of a Department
Quit
Use the arrow keys to navigate through the options and press Enter to select.

Features
View Departments: Lists all departments with their IDs.
View Roles: Lists all roles with their ID, title, department, and salary.
View Employees: Lists all employees with their ID, name, title, department, salary, and manager.
Add a Department: Adds a new department to the database.
Add a Role: Adds a new role to a specific department in the database.
Add an Employee: Adds a new employee with a role and manager to the database.
Update Employee Role: Updates the role of an existing employee.
View Employees by Manager: Lists employees grouped by their managers.
View Employees by Department: Lists employees grouped by their departments.
Delete Departments, Roles, and Employees: Allows deletion of departments, roles, and employees from the database.
View Total Utilized Budget of a Department: Calculates and displays the combined salaries of all employees in a department.




Walkthrough video URL: https://drive.google.com/file/d/1mNf_39sCZQefqmqB9GNYxFf2Frx8YpDe/view?usp=sharing