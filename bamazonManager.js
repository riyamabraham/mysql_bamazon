//inculde mysql and inquirer package

var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');

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
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }).then(function (answer) {
        switch (answer.choices) {
            case "View Products for Sale":
                display();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            default:
                break;
        }
    });
}


function display() {
    var query = "SELECT item_id,product_name,stock_quantity,department_name,price FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id :".green + res[i].item_id +
                " || Product:".green + res[i].product_name +
                " || Quantity Available :".green + res[i].stock_quantity +
                " || Department Name :".green+res[i].department_name+
                " || Price :".green + res[i].price);
        }
        search();
    });
}


function lowInventory() {
    console.log("Low inventory".red)
    var query = "SELECT item_id,product_name,price,stock_quantity ,department_name FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id :".green + res[i].item_id +
                " || Product:".green + res[i].product_name +
                " || Quantity Available :".green + res[i].stock_quantity +
                " || Department Name :".green+res[i].department_name+
                " || Price :".green + res[i].price);
        }
        search();
    });
}


function addInventory() {
    //display();
    console.log("Add to the existing inventory".magenta);
    inquirer.prompt([
        {
            name: "producttoupdate",
            type: "input",
            message: "Enter product name to update from the list",
        },
        {
            name: "department",
            type: "input",
            message: "Enter department name",
        },
        {
            name: "price",
            type: "input",
            message: "Enter price",
        },
        {
            name: "units",
            type: "input",
            message: "Enter number of Units",
        }
    ]).then(function (answer) {
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.units
                },
                {
                    product_name: answer.producttoupdate
                }
            ],
            function (err, res) {
                console.log(res.affectedRows + " product updated!\n");
                // Call updateProduct AFTER the INSERT completes
                display();
            }
        );
    });
}


function addProduct() {
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
            name: "price",
            type: "input",
            message: "Enter price",
        },
        {
            name: "units",
            type: "input",
            message: "Enter number of Units",
        }
    ]).then(function (answer) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.units
            },
            function (err, res) {
                console.log(res.affectedRows + " product inserted!\n");
                // Call updateProduct AFTER the INSERT completes
                display();
            }
        );
    });
}

