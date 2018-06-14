//inculde mysql and inquirer package

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');
var Table = require('cli-table');

//establish connection

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "riyamaryabraham",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw (err);
    search()
});


//functions

function search() {
    console.log("CHOOSE FROM THE BELOW OPTIONS".magenta);

    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "select".yellow,
        choices: [
            "View Product Sales by Department",
            "Create New Department"
        ]
    }).then(function (answer) {
        switch (answer.choices) {
            case "View Product Sales by Department":
                display();
                break;
            case "Create New Department":
                create();
                break;
            default:
                break;
        }
    });
}



function totaldisplay() {
    var query = "SELECT department_id,department_name,over_head_cost FROM departments";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id :".green + res[i].department_id +
            " || Department Name:".green + res[i].department_name +
            " || Over Head Cost :".green + res[i].over_head_cost);
        }
        search();
    });
}

function display() {
    var query = "SELECT departments.department_id,departments.department_name,departments.over_head_cost,products.product_sales FROM departments INNER JOIN products ON departments.department_name = products.department_name ";
    connection.query(query, function (err, res) {
        // instantiate
        var table = new Table({
            head: ['Department_Id', 'Department_name', 'Over_head_cost','Product_sales','Total_Profit']
            , colWidths: [20, 20, 20,20,20]
        });

        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].department_id, res[i].department_name, res[i].over_head_cost,res[i].product_sales,
                res[i].product_sales - res[i].over_head_cost]
            );
        }

        console.log(table.toString());


        search();
    });



}

function create() {
    console.log("Add a new product".magenta);

    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Enter product name",
        },
        {
            name: "department",
            type: "input",
            message: "Enter department name",
        },
        {
            name: "cost",
            type: "input",
            message: "Enter over head cost",
        }
    ]).then(function (answer) {
        var query = connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answer.department,
                over_head_cost: answer.cost
            },
            function (err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                totaldisplay();
            }
        );
    });
}



///to do table creation