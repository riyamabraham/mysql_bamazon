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
    var query = "SELECT item_id,product_name,stock_quantity,department_name,price FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(
                "Id :".green + res[i].item_id +
                " || Product:".green + res[i].product_name +
                " || Quantity Available :".green+res[i].stock_quantity+
                " || Department Name :".green+res[i].department_name+
                " || Price :".green + res[i].price);
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

       

        var query = "SELECT item_id,product_name,price,stock_quantity,department_name,product_sales FROM products WHERE ?";
        connection.query(query, { item_id: answer.id }, function (err, res) {

            for (var i = 0; i < res.length; i++) {

                if (answer.units > res[i].stock_quantity) {
                    console.log("Insufficient quantity".red);
                    search();
                }
                else {
                    console.log("Proceed to checkout".green);
                    console.log(
                        "Id :".green + res[i].item_id +
                        " || Product:".green + res[i].product_name +
                        " || Individual_price :".green + res[i].price + 
                        " || Total_Price :".green + answer.units * res[i].price+
                        " || Department Name :".green+res[i].department_name+
                        " || Quantity Available :".green+res[i].stock_quantity);
                    
                        console.log("Updating the stock quantities...\n".bgMagenta);
                        //console.log(res[i].stock_quantity);
                        var newquantity =  res[i].stock_quantity - answer.units;
                        // console.log("newquantity: "+newquantity);
                        // console.log(answer.id);
                        update(newquantity,answer.id);
                        updatesales(newquantity,answer.id,answer.units,res[i].price,res[i].product_sales);
                }
            }
           
        });

    });
}


function update(newquantity,id){
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query,
        [
            {
                stock_quantity :newquantity
            },
            {
                item_id : id
            }
        ],function(err,res){
            console.log(res.affectedRows + " products updated!\n".green);
        });
}


function updatesales(newquantity,id,units,price,product_sales){
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query,
    [
        {
            product_sales: product_sales + (units * price)
        },
        {
            item_id: id
        }
    ],function(err,res){
        console.log(res.affectedRows + " products updated!\n".green);
        search();
    });
   

}