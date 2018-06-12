//inculde mysql and inquirer package

var mysql = require("mysql");
var inquirer = require("inquirer");

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
    console.log("CHOOSE FROM THE BELOW OPTIONS");

    inquirer.prompt({
        name: "choices",
        type: "list",
        message: "select",
        choices: [
            "Display all",
            "To buy"
        ]
    }).then(function (answer) {
        switch (answer.choices) {
            case "Display all":
                display();
                break;
            case "To buy":
                buy();
                break;
            default:
                break;
        }
    });
}


function display() {
    var query = "SELECT item_id,product_name,price FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id :" + res[i].item_id +
                " || Product:" + res[i].product_name +
                " || Price :" + res[i].price);
        }
        search();
    });
}


function buy() {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter product ID",
        },
        {
            name: "units",
            type: "input",
            message: "Enter number of Units",
        }
    ]).then(function (answer) {

        var query = "SELECT item_id,product_name,price,stock_quantity FROM products WHERE ?";
        connection.query(query, { item_id: answer.id }, function (err, res) {

            for (var i = 0; i < res.length; i++) {

                if (answer.units > res[i].stock_quantity) {
                    console.log("Insufficient quantity");
                }
                else {
                    console.log("Proceed to checkout");
                    console.log(
                        "Id :" + res[i].item_id +
                        " || Product:" + res[i].product_name +
                        " || Individual_price :" + res[i].price + " || Total_Price :" + answer.units * res[i].price);
                    
                        console.log("Updating the stock quantities...\n");
                        console.log(res[i].stock_quantity);                       
                }
            }
            search();
        });

    });
}


