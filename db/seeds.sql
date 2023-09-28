USE employee_DB;

-- Department --
INSERT INTO department (id, name) VALUES (1, "Sales");
INSERT INTO department (id, name) VALUES (2, "Engineering");
INSERT INTO department (id, name) VALUES (3, "Finance");
INSERT INTO department (id, name) VALUES (4, "IT");

-- Role --
INSERT INTO ROLE (id, title, salary, department_id) VALUES (1, "Salesperson", 60000, 1);          
INSERT INTO ROLE (id, title, salary, department_id) VALUES (2, "Manager", 105000, 1);               
INSERT INTO ROLE (id, title, salary, department_id) VALUES (3, "Sales Lead", 80000, 1);            
INSERT INTO ROLE (id, title, salary, department_id) VALUES (4, "Lead Engineer", 120000, 2);         
INSERT INTO ROLE (id, title, salary, department_id) VALUES (5, "Senior Engineer", 110000, 3);       
INSERT INTO ROLE (id, title, salary, department_id) VALUES (6, "Accountant", 70000, 3);             
INSERT INTO ROLE (id, title, salary, department_id) VALUES (7, "IT Manager", 120000, 4);            
INSERT INTO ROLE (id, title, salary, department_id) VALUES (8, "System Administrator", 85000, 4);   
INSERT INTO ROLE (id, title, salary, department_id) VALUES (9, "IT Coordinator", 70000, 4);         


-- Employees --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (4, "Jessica", "Brown", 3, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (5, "John", "Williams", 4, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (7, "Melissa", "Jones", 6, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (10, "Jonathan", "Smith", 9, null);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (3, "Alla", "Fishman", 2, 4);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (1, "Marty", "Davis", 1, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (2, "Michael", "Scofield", 1, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (6, "Jack", "Shepard", 5, 7);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (8, "Dany", "Garcia", 7, 10);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (9, "David", "Miller", 8, 10);
