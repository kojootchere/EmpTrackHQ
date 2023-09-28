// Importing required packages.
import mysql from "mysql2";
import inquirer from 'inquirer';
import promisemysql from "promise-mysql";

// Connection properties for MySQL database.
// NOTE: For better security, move these properties to a .env file and access them using process.env.
const connectionProperties = {
    host: '127.0.0.1',
    user: 'newuser',
    database: 'employee_DB',
    password: 'password'
};

// Creating a connection to the database using the specified properties.
const connection = mysql.createConnection(connectionProperties);

// Attempting to establish a connection to the database.
connection.connect((err) => {
    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    }
    console.log("\n WELCOME TO EMPLOYEE TRACKER \n");
    mainMenu();
});

/**
 * Presents the main menu to the user.
 * Depending on the user's choice, respective functions are invoked.
 */
function mainMenu() {

    // Using Inquirer to prompt the user to choose an option.
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please choose one of the following",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "View all employees by role",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add role",
                "Add department",
                "Update employee",
                "Update employee role",
                "Update employee managers",
                "Update employee department",
                "Delete employee",
                "Delete roles",
                "Delete departments",
            ]
        })
        .then((answer) => {

            // Handle user's choice and invoke the respective function.
            switch (answer.action) {
                case "View all employees":
                    viewAllEmp();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all departments":
                    viewAllDepts();
                    break;
                case "View all employees by role":
                    viewAllEmpByRole();
                    break;
                case "View all employees by department":
                    viewAllEmpByDept();
                    break;
                case "View all employees by manager":
                    viewAllEmpByMngr();
                    break;
                case "Add employee":
                    addEmp();
                    break;
                case "Add role":
                    addRole();
                    break;
                case "Add department":
                    addDept();
                    break;
                case "Update employee":
                    updateEmp();
                    break;
                case "Update employee role":
                    updateEmpRole();
                    break;
                case "Update employee managers":
                    updateEmpMngr();
                    break;
                case "Update employee department":
                    updateEmpDept();
                    break;
                case "Delete employee":
                    removeEmp();
                    break;
                case "Delete roles":
                    removeRoles();
                    break;
                case "Delete departments":
                    removeDept();
                    break;
            }
        });
}

/**
 * Fetches and displays a table of all employees, their roles, departments, salaries, and their managers.
 */
function viewAllEmp() {
    // SQL query string to fetch required data.
    const query = `
    SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department,
           role.salary, concat(m.first_name, ' ', m.last_name) AS manager 
    FROM employee e 
    LEFT JOIN employee m ON e.manager_id = m.id 
    INNER JOIN role ON e.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    ORDER BY ID ASC`;

    // Executing the SQL query.
    connection.query(query, function (err, res) {
        if (err) {
            console.error("Error fetching data: ", err);
            return mainMenu();
        }
        console.log("\n");
        console.table(res); // Display the results in tabular format.
        mainMenu();         // Redirect user back to the main menu.
    });
}

/**
 * Fetches and displays a table of all roles, along with their departments and salaries.
 */
function viewAllRoles() {
    // SQL query string to fetch roles with their respective departments and salaries.
    const query = `
        SELECT role.id, role.title, department.name AS department, role.salary
        FROM role
        INNER JOIN department ON role.department_id = department.id 
        ORDER BY role.id ASC`;

    // Executing the SQL query.
    connection.query(query, function (err, res) {
        if (err) {
            console.error("Error fetching data: ", err);
            return mainMenu();
        }
        console.log("\n");
        console.table(res); // Display the results in tabular format.
        mainMenu();         // Redirect user back to the main menu.
    });
}

/**
 * Fetches and displays a table of all departments.
 */
function viewAllDepts() {
    // SQL query string to fetch all departments.
    const query = `
            SELECT id, name AS department 
            FROM department
            ORDER BY id ASC`;

    // Executing the SQL query.
    connection.query(query, function (err, res) {
        if (err) {
            console.error("Error fetching data: ", err);
            return mainMenu();
        }
        console.log("\n");
        console.table(res); // Display the results in tabular format.
        mainMenu();         // Redirect user back to the main menu.
    });
}



/**
 * Fetches and displays a list of employees by role.
 */
function viewAllEmpByRole() {
    // Query to fetch all role titles
    let query = "SELECT title FROM role";

    // Create a connection and retrieve roles
    promisemysql.createConnection(connectionProperties)
        .then(conn => conn.query(query))
        .then(role => {
            // Map roles into an array of role titles
            let roleArr = role.map(role => role.title);

            // Prompt the user to choose a role
            return inquirer.prompt({
                name: "role",
                type: "list",
                message: "Which role would you like to search?",
                choices: roleArr
            });
        })
        .then(answer => {
            // Construct query to fetch employees by the selected role
            const query = `
            SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name',
                   role.title AS Title, department.name AS Department, role.salary AS Salary,
                   concat(m.first_name, ' ', m.last_name) AS Manager 
            FROM employee e 
            LEFT JOIN employee m ON e.manager_id = m.id 
            INNER JOIN role ON e.role_id = role.id 
            INNER JOIN department ON role.department_id = department.id 
            WHERE role.title = ?
            ORDER BY ID ASC`;

            // Execute the query with the selected role as the argument
            return new Promise((resolve, reject) => {
                connection.query(query, [answer.role], (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        })
        .then(res => {
            console.log("\n");
            console.table(res);  // Display the results in a table format
            mainMenu();
        })
        .catch(err => {
            console.error("Error: ", err);
            mainMenu();
        });
}

/**
 * Fetches and displays a list of employees by department.
 */
function viewAllEmpByDept() {
    // Query to fetch all department names
    let query = "SELECT name FROM department";

    // Create a connection and retrieve department names
    promisemysql.createConnection(connectionProperties)
        .then(conn => conn.query(query))
        .then(departments => {
            // Map departments into an array of department names
            let deptArr = departments.map(dept => dept.name);

            // Prompt the user to choose a department
            return inquirer.prompt({
                name: "department",
                type: "list",
                message: "Which department would you like to search?",
                choices: deptArr
            });
        })
        .then(answer => {
            // Construct query to fetch employees by the selected department
            const query = `SELECT e.id AS ID, e.first_name AS 'First Name', e.last_name AS 'Last Name',
                   role.title AS Title, department.name AS Department, role.salary AS Salary,
                   concat(m.first_name, ' ', m.last_name) AS Manager 
            FROM employee e 
            LEFT JOIN employee m ON e.manager_id = m.id 
            INNER JOIN role ON e.role_id = role.id 
            INNER JOIN department ON role.department_id = department.id 
            WHERE department.name = ?
            ORDER BY ID ASC`;


            // Execute the query with the selected department as the argument
            return new Promise((resolve, reject) => {
                connection.query(query, [answer.department], (err, res) => {
                    if (err) reject(err);
                    resolve(res);
                });
            });
        })
        .then(res => {
            console.log("\n");
            console.table(res);  // Display the results in a table format
            mainMenu();
        })
        .catch(err => {
            console.error("Error: ", err);
            mainMenu();
        });
}

/**
 * Fetches and displays a list of employees by their managers.
 */
function viewAllEmpByMngr() {
    let managerArr = [];  // Array to store manager names

    // Create a connection and retrieve distinct managers
    promisemysql.createConnection(connectionProperties)
        .then(conn => {
            return conn.query("SELECT DISTINCT m.id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e Inner JOIN employee m ON e.manager_id = m.id");
        })
        .then(managers => {
            // Populate the managerArr with manager names
            for (let i = 0; i < managers.length; i++) {
                managerArr.push(managers[i].manager);
            }

            // Prompt the user to choose a manager
            return inquirer.prompt({
                name: "manager",
                type: "list",
                message: "Which manager would you like to search?",
                choices: managerArr
            });
        })
        .then(answer => {
            // Determine the manager's ID based on their name
            let managerID;
            for (let i = 0; i < managers.length; i++) {
                if (answer.manager == managers[i].manager) {
                    managerID = managers[i].id;
                }
            }

            // Construct query to fetch employees managed by the selected manager
            const query = `SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager
            FROM employee e
            LEFT JOIN employee m ON e.manager_id = m.id
            INNER JOIN role ON e.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            WHERE e.manager_id = ${managerID};`;

            // Execute the query
            connection.query(query, (err, res) => {
                if (err) return err;
                console.log("\n");
                console.table(res);  // Display the results in a table format
                mainMenu();
            });
        });
}


/**
 * Add a new employee to the database.
 * 1. Fetch roles and employees from the database.
 * 2. Use `inquirer` to prompt the user for the new employee's details.
 * 3. Insert the new employee details into the database.
 */
function addEmp() {
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {

        for (let i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        for (let i = 0; i < managers.length; i++) {
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        managerArr.unshift('--');

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "First name: ",

                validate: function (input) {
                    if (input === "") {
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                name: "lastName",
                type: "input",
                message: "Lastname: ",

                validate: function (input) {
                    if (input === "") {
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            {

                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            }, {

                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                let roleID;

                let managerID = null;

                for (let i = 0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

                for (let i = 0; i < managers.length; i++) {
                    if (answer.manager == managers[i].Employee) {
                        managerID = managers[i].id;
                    }
                }

                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if (err) return err;

                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainMenu();
                });
            });
    });
}

/**
 * Add a new role to the database.
 * 1. Fetch the list of departments.
 * 2. Use `inquirer` to prompt the user for the new role details.
 * 3. Insert the new role details into the database.
 */
function addRole() {
    let departmentArr = [];

    promisemysql.createConnection(connectionProperties).then((conn) => {
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');
    }).then((departments) => {

        for (let i = 0; i < departments.length; i++) {
            departmentArr.push(departments[i].name);
        }

        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Role title: ",
                validate: function (input) {
                    if (input === "") {
                        console.log("**FIELD REQUIRED**");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "salary",
                type: "input",
                message: "Role salary: ",
                validate: function (input) {
                    if (isNaN(input) || input === "") {
                        console.log("**VALID NUMBER REQUIRED**");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "department",
                type: "list",
                message: "Which department does this role belong to?",
                choices: departmentArr
            }
        ]).then((answer) => {
            let departmentID;

            for (let i = 0; i < departments.length; i++) {
                if (answer.department == departments[i].name) {
                    departmentID = departments[i].id;
                }
            }

            connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.title, answer.salary, departmentID], (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }

                console.log(`\n ROLE ${answer.title} ADDED...\n `);
                mainMenu();
            });
        });
    });
}

/**
 * Add a new department to the database.
 * 1. Use `inquirer` to prompt the user for the new department's name.
 * 2. Insert the new department into the database.
 */
function addDept() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "Department name: ",
            validate: function (input) {
                if (input === "") {
                    console.log("**FIELD REQUIRED**");
                    return false;
                } else {
                    return true;
                }
            }
        }
    ]).then((answer) => {

        connection.query(`INSERT INTO department (name) VALUES (?)`, [answer.departmentName], (err, res) => {
            if (err) {
                console.error(err);
                return;
            }

            console.log(`\n DEPARTMENT ${answer.departmentName} ADDED...\n `);
            mainMenu();
        });
    });
}

/**
 * Update an existing employee's details.
 * 1. Fetch roles, employees, and managers from the database.
 * 2. Use `inquirer` to prompt the user for the employee's updated details.
 * 3. Update the employee's details in the database.
 */
function updateEmp() {
    let employeeArr = [];
    let roleArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties)
        .then((conn) => {
            return Promise.all([
                conn.query('SELECT id, title FROM role ORDER BY title ASC'),
                conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC"),
                conn.query("SELECT id, concat(first_name, ' ' , last_name) AS ManagerName FROM employee WHERE manager_id IS NULL")
            ]);
        }).then(([roles, employees, managers]) => {
            for (let i = 0; i < roles.length; i++) {
                roleArr.push(roles[i].title);
            }

            for (let i = 0; i < employees.length; i++) {
                employeeArr.push(employees[i].Employee);
            }

            for (let i = 0; i < managers.length; i++) {
                managerArr.push(managers[i].ManagerName);
            }

            return Promise.all([roles, employees, managers]);
        }).then(([roles, employees, managers]) => {
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to edit?",
                    choices: employeeArr
                },
                {
                    name: "firstName",
                    type: "input",
                    message: "Updated first name: ",
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "Updated last name: ",
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their new role?",
                    choices: roleArr
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is their new manager?",
                    choices: managerArr
                }
            ]).then((answer) => {
                let roleID;
                let employeeID;
                let managerID;

                for (let i = 0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

                for (let i = 0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                for (let i = 0; i < managers.length; i++) {
                    if (answer.manager == managers[i].ManagerName) {
                        managerID = managers[i].id;
                    }
                }

                connection.query(`UPDATE employee SET first_name = "${answer.firstName}", last_name = "${answer.lastName}", role_id = ${roleID}, manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;

                    console.log(`\n ${answer.firstName} ${answer.lastName}'s details updated...\n `);
                    mainMenu();
                });
            });
        });
}

/**
 * Update an existing employee's role.
 * 1. Fetch roles and employees from the database.
 * 2. Use `inquirer` to prompt the user for the employee's new role.
 * 3. Update the employee's role in the database.
 */
function updateEmpRole() {
    let employeeArr = [];
    let roleArr = [];


    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            conn.query('SELECT id, title FROM role ORDER BY title ASC'),
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {


        for (let i = 0; i < roles.length; i++) {
            roleArr.push(roles[i].title);
        }

        for (let i = 0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);

        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {

                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {

                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                for (let i = 0; i < roles.length; i++) {
                    if (answer.role == roles[i].title) {
                        roleID = roles[i].id;
                    }
                }

                for (let i = 0; i < employees.length; i++) {
                    if (answer.employee == employees[i].Employee) {
                        employeeID = employees[i].id;
                    }
                }

                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if (err) return err;


                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    mainMenu();
                });
            });
    });
}

/**
 * Update an employee's manager.
 * 1. Fetch the list of all employees.
 * 2. Prompt the user to select the employee whose manager they want to update and the new manager.
 * 3. Update the manager for the chosen employee in the database.
 */
function updateEmpMngr() {
    let employeeArr = [];
    let managerArr = [];

    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC");
    }).then((employees) => {

        for (let i = 0; i < employees.length; i++) {
            employeeArr.push(employees[i].Employee);
            managerArr.push(employees[i].Employee); // A manager is also an employee
        }

        return employees;
    }).then((employees) => {

        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Whose manager would you like to edit?",
                choices: employeeArr
            },
            {
                name: "manager",
                type: "list",
                message: "Who is their new manager?",
                choices: managerArr
            },
        ]).then((answer) => {

            let managerID;
            let employeeID;

            for (let i = 0; i < employees.length; i++) {
                if (answer.manager == employees[i].Employee) {
                    managerID = employees[i].id;
                }

                if (answer.employee == employees[i].Employee) {
                    employeeID = employees[i].id;
                }
            }

            connection.query(`UPDATE employee SET manager_id = ${managerID} WHERE id = ${employeeID}`, (err, res) => {
                if (err) return err;

                console.log(`\n ${answer.employee}'s MANAGER UPDATED TO ${answer.manager}...\n`);

                mainMenu();
            });
        });
    });
}

/**
 * Update an employee's department.
 * 1. Fetch the list of all departments and employees.
 * 2. Prompt the user to select the employee whose department they want to update and the new department.
 * 3. Notify the user to also update the role associated with the new department.
 */
function updateEmpDept() {
    let employeeArr = [];
    let deptArr = [];

    promisemysql.createConnection(connectionProperties)
        .then((conn) => {
            return Promise.all([
                conn.query("SELECT id, name FROM department ORDER BY name ASC"),
                conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
            ]);
        })
        .then(([departments, employees]) => {

            for (let i = 0; i < departments.length; i++) {
                deptArr.push(departments[i].name);
            }

            for (let i = 0; i < employees.length; i++) {
                employeeArr.push(employees[i].Employee);
            }

            return inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Whose department would you like to edit?",
                    choices: employeeArr
                },
                {
                    name: "department",
                    type: "list",
                    message: "Which department would you like to move them to?",
                    choices: deptArr
                },
            ]);
        })
        .then((answer) => {

            console.log(`To move ${answer.employee} to the ${answer.department} department, please also update their role to one associated with that department.`);
            updateEmpRole()
        });
}

/**
 * Remove an employee from the database.
 * 1. Fetch the list of all employees.
 * 2. Prompt the user to select an employee to remove.
 * 3. Delete the chosen employee from the database.
 */
function removeEmp() {
    // Step 1: Query all employees
    const listEmployees = () => {
        connection.query('SELECT id, CONCAT(first_name, " ", last_name) as name FROM employee', (err, results) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'employeeToDelete',
                    type: 'list',
                    message: 'Select an employee to delete:',
                    choices: results.map(employee => ({
                        name: employee.name,
                        value: employee.id
                    }))
                }
            ])
                .then(answer => {
                    // Step 3: Delete the selected employee
                    deleteEmployee(answer.employeeToDelete);
                });
        });
    };

    const deleteEmployee = (employeeId) => {
        const query = 'DELETE FROM employee WHERE id = ?';
        connection.query(query, [employeeId], function (error, results) {
            if (error) throw error;
            console.log(`Deleted ${results.affectedRows} row(s)`);
            mainMenu();
        });
    };

    // Start the process
    listEmployees();
}

/**
 * Remove a role from the database.
 * 1. Fetch the list of all roles.
 * 2. Prompt the user to select a role to remove.
 * 3. Check if there are any employees with the selected role.
 * 4. If there are no associated employees, delete the role; otherwise, notify the user.
 */
function removeRoles() {
    // Step 1: Query all roles
    const listRoles = () => {
        connection.query('SELECT id, title FROM role', (err, results) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'roleToDelete',
                    type: 'list',
                    message: 'Select a role to delete:',
                    choices: results.map(role => ({
                        name: role.title,
                        value: role.id
                    }))
                }
            ])
                .then(answer => {
                    // Step 2: Delete the selected role
                    deleteRole(answer.roleToDelete);
                });
        });
    };

    const deleteRole = (roleId) => {
        // First check if there are any employees with the selected role
        const checkQuery = 'SELECT COUNT(*) as count FROM employee WHERE role_id = ?';
        connection.query(checkQuery, [roleId], function (error, results) {
            if (error) throw error;

            // If the count is greater than 0, it means there are employees associated with that role
            if (results[0].count > 0) {
                console.log('Cannot delete this role as there are employees associated with it. Update or remove the employees with this role first.');
                mainMenu();
            } else {
                // If no employees are associated with this role, proceed with deleting the role
                const deleteQuery = 'DELETE FROM role WHERE id = ?';
                connection.query(deleteQuery, [roleId], function (error, results) {
                    if (error) throw error;
                    console.log(`Deleted ${results.affectedRows} row(s)`);
                    mainMenu();
                });
            }
        });
    };

    // Start the process
    listRoles();
};


/**
 * Remove a department from the database.
 * 1. Fetch the list of all departments.
 * 2. Prompt the user to select a department to remove.
 * 3. Check if there are roles or employees associated with the department.
 * 4. If there are no associations, delete the department; otherwise, notify the user.
 */
function removeDept() {
    // Step 1: Query all departments
    const listDepartments = () => {
        connection.query('SELECT id, name FROM department', (err, results) => {
            if (err) throw err;

            inquirer.prompt([
                {
                    name: 'departmentToDelete',
                    type: 'list',
                    message: 'Select a department to delete:',
                    choices: results.map(department => ({
                        name: department.name,
                        value: department.id
                    }))
                }
            ])
                .then(answer => {
                    // Step 2: Delete the selected department
                    deleteDepartment(answer.departmentToDelete);
                });
        });
    };

    const deleteDepartment = (departmentId) => {
        // First check if there are any roles associated with the department
        const checkRolesQuery = 'SELECT COUNT(*) as count FROM role WHERE department_id = ?';
        connection.query(checkRolesQuery, [departmentId], function (error, rolesResults) {
            if (error) throw error;

            // If there are roles associated with the department
            if (rolesResults[0].count > 0) {
                console.log('Cannot delete this department as there are roles associated with it. Remove the roles first.');
                mainMenu();
                return;
            }

            // Next, check if there are any employees in the department
            const checkEmployeesQuery = 'SELECT COUNT(*) as count FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = ?)';
            connection.query(checkEmployeesQuery, [departmentId], function (error, employeesResults) {
                if (error) throw error;

                // If there are employees associated with the department
                if (employeesResults[0].count > 0) {
                    console.log('Cannot delete this department as there are employees associated with it. Remove the employees first.');
                    mainMenu();
                } else {
                    // If no roles and no employees, proceed with deleting the department
                    const deleteQuery = 'DELETE FROM department WHERE id = ?';
                    connection.query(deleteQuery, [departmentId], function (error, results) {
                        if (error) throw error;
                        console.log(`Deleted ${results.affectedRows} row(s)`);
                        mainMenu();
                    });
                }
            });
        });
    };

    // Start the process
    listDepartments();
};



