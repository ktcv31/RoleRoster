INSERT INTO department (name)
VALUES  ('Engineering'),
        ('Finance'),
        ('Marketing'),
        ('Sales'),
        ('Legal');


INSERT INTO role (title, salary, department_id)
VALUES  ('Engineering Manager', 140000, 1),
        ('Engineering Lead', 110000, 1),
        ('Staff Engineer', 90000, 1),
        ('Finance Manager', 95000, 2), 
        ('Accountant', 60000, 2),
        ('Brand Advocate Manager', 105000, 3),
        ('Brand Advocate Sr. Analyst', 92000, 3),
        ('Brand Advocate Analyst', 80000, 3),
        ('Sales Manager', 65000, 4),
        ('Salesperson', 55000, 4),
        ('Legal Manager', 118000, 5),
        ('Lawyer', 92000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),  
       ('Jordan', 'Davis', 4, NULL), 
       ('Casey', 'Patel', 6, NULL), 
       ('Cameron', 'Lee', 9, NULL), 
       ('Drew', 'Garcia', 11, NULL); 


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Chris', 'Brown', 2, 1),  
       ('Taylor', 'Miller', 3, 1), 
       ('Morgan', 'Davis', 5, 2),  
       ('Sydney', 'Patel', 7, 3), 
       ('Riley', 'Patel', 8, 3), 
       ('Parker', 'Lee', 10, 4), 
       ('Bailey', 'Garcia', 12, 5);
