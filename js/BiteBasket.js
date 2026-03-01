/// EVENT LISTENERS -- BEGIN///

//when users click the submit button after entering an ingredient, the program will fetch and choose --
//-- a meal for the user
let submit_Button = document.getElementById("Submit_button");
submit_Button.addEventListener("click", taking_Orders);

//when the user clicks the complete button after entering their order number, the program will --
//change the status of their order to complete
let complete_Button = document.getElementById("Complete_button");
complete_Button.addEventListener("click", update_Status);

//displaying all incomplete orders as soon as the webpage loads
document.addEventListener("DOMContentLoaded", displaying_Orders);

//displaying all incomplete orders as soon as the webpage loads
document.addEventListener("DOMContentLoaded", active_Orders);

/// EVENT LISTENERS -- END///

////////////////////////////////////////////////////////////////////////////////////////////////////////

/// REUSABLE FUNCTIONS -- BEGIN ///

//FUNCTION THAT RETRIEVES THE EXISTING DATA IN OBJECT_ORDERS
function loading_Orders() {
  //getting the object_Orders data from session storage and saving it to a variable
  let object_Orders = sessionStorage.getItem("object_Orders");
  //if there isn't any orders in object_Orders yet, then the variable will have a null value
  if (object_Orders === null) {
    //if the variable has a null value, it will be assigned an empty array ready to be populated
    object_Orders = [];
  } else {
    //if the variable does not have a null value --> there were orders in object_Orders
    //then object_Orders is populated with the previous orders that are stored in session storage, --
    // -- and changed from a string value to a JavaScript object
    object_Orders = JSON.parse(object_Orders);
  }

  return object_Orders;
}

//FUNCTION THAT FETCHES THE LAST ORDER NUMBER
function get_last_order_Number() {
  //getting the last_order_Number from session storage and saving it to a variable
  let order_Number = sessionStorage.getItem("order_Number");
  //if there isn't a value in last_order_Number yet, then the variable will have a null value
  if (order_Number === null) {
    //if the variable has a null value, it will be assigned to 0
    order_Number = 0;
  } else {
    //if the variable does not have a null value --> there was a number in last_order_Number
    //then last_order_Number is retrieved from session storage, and changed from a string value to --
    //-- a JavaScript object
    order_Number = Number(order_Number);
  }

  return order_Number;
}

//FUNCTION THAT CONVERTS THE INGREDIENT INPUT INTO A USABLE FORMAT FOR THE URL
function convert_Ingredient(user_Ingredient) {
  //converting user's input to all lowercase
  let reformed_user_Ingredient = user_Ingredient.toLowerCase();
  //replacing any spaces with a underscore and returning reformed ingredient name
  return reformed_user_Ingredient.replace(/\s+/g, "_");
}

/// REUSABLE FUNCTIONS -- END ///

////////////////////////////////////////////////////////////////////////////////////////////////////////

/// ACTIVE ORDERS -- BEGIN ///

//FUNCTION THAT TELLS USERS HOW MANY ORDERS ARE CURRENTLY INCOMPLETE
function active_Orders() {
  let object_Orders = loading_Orders();
  let order_Count = 0;

  object_Orders.forEach((order) => {
    if (order.Status === "Incomplete") {
      order_Count += 1;
    }
  });

  let show_active_Orders = document.getElementById("Active_orders");
  show_active_Orders.textContent = "Active orders: " + order_Count;
}

/// ACTIVE ORDERS -- END ///

///////////////////////////////////////////////////////////////////////////////////////////////////////

/// TAKING ORDERS -- BEGIN ///

//FUNCTION THAT TAKES THE INGREDIENT INPUT, GETS A RANDOM MEAL, AND GENERATES AND SAVES THE ORDER
function taking_Orders() {
  //getting ingredient name given by the user from html document
  let user_Ingredient = document.getElementById("User_ingredient").value;

  if (user_Ingredient.trim() === "") {
    alert("Please enter an ingredient!");
  } else {
    //using the convert_Ingredient() function to get the usable form of the ingredient name
    let reformed_user_Ingredient = convert_Ingredient(user_Ingredient);

    let object_Orders = loading_Orders();
    let order_Number = get_last_order_Number();

    //ASYNC FUNCTION THAT GENERATES AND SAVES A RANDOM MEAL BASED ON THE INGREDIENT INPUT
    async function random_Meal() {
      try {
        //fetching data of all meals containing the specified ingredient from API using --
        //-- link + ingredient name
        let possible_Meals = await fetch(
          "https://www.themealdb.com/api/json/v1/1/filter.php?i=" +
            reformed_user_Ingredient,
        );

        //making data a usable JavaScript object
        let usable_possible_Meals = await possible_Meals.json();
        //retrieving the array containing the actual meals
        let meals_Array = usable_possible_Meals.meals;

        //checking that ingredient exists
        if (meals_Array !== null) {
          //random_Number will be used to pick a random meal from the list of meals containing the --
          //-- specified ingredient
          let random_Num = Math.floor(Math.random() * meals_Array.length);
          //getting the name of the randomly picked meal
          let random_meal_Name = meals_Array[random_Num].strMeal;

          //incrementing the order number
          order_Number += 1;
          //saving order number to session storage
          sessionStorage.setItem("order_Number", order_Number);

          //adding attributes of the order using key-value pairs
          object_Orders.push({
            Description: random_meal_Name,
            Number: order_Number,
            Status: "Incomplete",
          });

          //saving order to session storage
          sessionStorage.setItem(
            "object_Orders",
            JSON.stringify(object_Orders),
          );

          //displaying the order description and order number to the user
          let order_Details = document.getElementById(
            "Order_submission_verdict",
          );
          order_Details.textContent =
            "You'll be enjoying a " +
            random_meal_Name +
            "! Your order number is: " +
            order_Number;
          document.getElementById("Order_submission_verdict").style.textAlign =
            "center";

          //displaying orders creating taking a new one
          displaying_Orders();
          //displaying amount of incomplete orders
          active_Orders();
        } else {
          document.getElementById("User_ingredient").value = "";
          alert(
            "No meals found that include " +
              user_Ingredient +
              ". Please enter another ingredient",
          );
        }
      } catch (error) {
        //alerting users that there is an error and what the error is
        alert("Something went wrong while fetching meals. Please try again");
        console.error(error);
      }
    }
    //calling the random_Meal() function
    random_Meal();
  }
}

/// TAKING ORDERS -- END ///

////////////////////////////////////////////////////////////////////////////////////////////////////////

/// DISPLAYING ORDERS -- BEGIN ///

function displaying_Orders() {
  let object_Orders = loading_Orders();

  //CREATING TITLE ROW FOR ORDER BOARD -- BEGIN//

  let container = document.querySelector(".Container");
  //clearing container
  container.innerHTML = "";

  //creating a title row
  let title_Row = document.createElement("div");
  title_Row.classList.add("row");

  //creating the title column for the order description
  let description_Column = document.createElement("div");
  description_Column.classList.add("col-md-6");
  let description_Title = document.createElement("div");
  description_Title.classList.add("description_Title");
  description_Title.textContent = "Description";
  //adding div containing title to column
  description_Column.appendChild(description_Title);

  //creating the title column for the order number
  let number_Column = document.createElement("div");
  number_Column.classList.add("col-md-6");
  let number_Title = document.createElement("div");
  number_Title.classList.add("number_Title");
  number_Title.textContent = "Order Number";
  //adding div containing title to column
  number_Column.appendChild(number_Title);

  //appending titles to container
  title_Row.appendChild(description_Column);
  title_Row.appendChild(number_Column);
  container.appendChild(title_Row);

  //CREATING TITLE ROW FOR ORDER BOARD -- END//

  //function that adds orders to the Display Board
  object_Orders.forEach((order) => {
    //getting the status of an order
    let Status = order.Status;
    let Number = order.Number;

    //if the status of the order is incomplete, it will be displayed in the Display Board
    if (Status === "Incomplete") {
      //creating a new row
      let new_Row = document.createElement("div");
      new_Row.classList.add("row");

      //styling the Display Board
      if (Number % 2 === 0) {
        new_Row.style.backgroundColor = "rgb(249, 213, 141)";
      } else {
        new_Row.style.backgroundColor = "rgb(243, 218, 168)";
      }
      new_Row.style.textAlign = "center";
      new_Row.style.marginLeft = "5vh";
      new_Row.style.marginRight = "5vh";
      new_Row.style.border = "solid black 0.2vh";

      //displaying the name of the meal
      let new_column_One = document.createElement("div");
      new_column_One.classList.add("col-md-6");
      let order_Description = document.createElement("div");
      order_Description.classList.add("order_Description");
      order_Description.textContent = order.Description;
      //attaching the column to the row
      new_column_One.appendChild(order_Description);

      //displaying the order number
      let new_column_Two = document.createElement("div");
      new_column_Two.classList.add("col-md-6");
      let order_Number = document.createElement("div");
      order_Number.classList.add("order_Number");
      order_Number.textContent = order.Number;
      //attaching the column to the row
      new_column_Two.appendChild(order_Number);

      //attaching new rows to the container
      new_Row.appendChild(new_column_One);
      new_Row.appendChild(new_column_Two);
      container.appendChild(new_Row);
    }
  });

  //ADDING ORDERS TO THE ORDER BOARD -- END//
}

/// DISPLAYING ORDERS -- END ///

//////////////////////////////////////////////////////////////////////////////////////////////////////

/// UPDATING AN ORDER'S STATUS -- BEGIN ///

//FUNCTION THAT UPDATES AN ORDER'S STATUS
function update_Status() {
  let object_Orders = loading_Orders();

  //getting order number that user provided
  let order_number_Input = Number(
    document.getElementById("Order_number").value,
  );

  //if the user put a 0 --> nothing happens
  if (order_number_Input === 0) {
    return;
  }

  //variable to keep track of whether or not the status was changed
  let order_Updated = false;

  //going through each order until the order number is found and changed
  object_Orders.forEach((order) => {
    if (order.Number === order_number_Input) {
      //changing status
      order.Status = "Complete";
      //changing variable
      order_Updated = true;
      //clearing input
      document.getElementById("Order_number").value = "";
    }
  });

  //if the variable was not changed --> order number was  not found --> alert user
  if (order_Updated === false) {
    alert("This order number does not exist! Please enter a valid number.");
    document.getElementById("Order_number").value = "";
  }

  //saving order to session storage
  sessionStorage.setItem("object_Orders", JSON.stringify(object_Orders));

  displaying_Orders();
  //displaying amount of incomplete orders
  active_Orders();
}

/// UPDATING AN ORDER'S STATUS -- END ///
