var inquirer = require('inquirer');

var mysql = require('mysql');

var quantity = 0;

var price = 0;

var userStockNumber = 0;

var subtotal = 0.00;

var numOfItems = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "bamazon_db"
  });
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    setTimeout(displayItems, 1000);
});
function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (!err) {
            numOfItems = res.length;
            res.forEach(function(e) {
                console.log('=========================================');
                console.log(`Stock Number: ${e.id}`);
                console.log(`Product: ${e.product_name}`);
                console.log(`Category: ${e.department_name}`);
                console.log(`Price: \$${e.price}`);
                console.log(`There are ${e.stock_quantity} left!`);
            }); console.log('=========================================');
        } else console.log(err);
}); setTimeout(pickItem, 1000);
}
function pickItem() {
    inquirer.prompt([
        {
            message: "What is the stock number of the item?",
            name: 'stockNumber',
            validate: function(value) {
                return value <= numOfItems;
            }
        }
    ]).then(function(item) {
        userStockNumber = item.stockNumber;
        var query = connection.query("SELECT stock_quantity, price FROM products WHERE ?",
        [
            {
                id: item.stockNumber
            }
        ], function(err, res) {
            if (!err) {
                quantity = res[0].stock_quantity;
                price = res[0].price;
                console.log(`There are ${quantity} available.`);
            } else console.log(err);
        }); setTimeout(pickQuantity, 1000);
    });
}

function pickQuantity() {
    inquirer.prompt([
        {
            message: "How many?",
            name: "userQuantity",
            validate: function(value) {
                if (quantity < value) {
                    console.log("\nInsufficent qunatity available");
                } if (value < 0) {
                    console.log("Invalid quantity");
                    return false;
                }
                return quantity >= value;
            } 
        }
    ]).then(function(item){
        subtotal = item.userQuantity * price;
        checkOut();
        var query = connection.query('UPDATE products SET ? WHERE ?', [
            {
                stock_quantity: quantity - item.userQuantity
            }, {
                id: userStockNumber
            }
        ], function(err, res) {
            if (!err) {
                console.log("Updated!");
            } else console.log(err);
        }); 
        quantity = 0;
        price = 0;
        userStockNumber = 0;
        subtotal = 0;
        connection.end();
    }); 
}

function checkOut() {
    console.log(`That will cost: \$${subtotal}\nThank You!`);
}