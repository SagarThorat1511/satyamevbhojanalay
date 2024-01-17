<?php
header('Content-Type: application/json');
// Check if it's a POST request with JSON data
if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{
                // Retrieve the raw POST data
                $data = file_get_contents("php://input");
                // Set the time zone to Asia/Kolkata
                date_default_timezone_set("Asia/Kolkata");

                // Decode the JSON data
                $data = json_decode($data);

                if ($data === null) {
                    // JSON decoding failed
                    echo json_encode(["error" => "Invalid JSON data"]);
                } else {
                    if(isset($data->userData))
                    {
                        // Extract data from the JSON object
                        $userData=$data->userData;
                        $name = $userData->name;
                        $number = $userData->number;
                        $address = $userData->address;
                        $building=$userData->building;
                        $flatNumber=$userData->flatNumber;

                        $conn = createDatabaseConnection();

                        // Check connection
                        if ($conn->connect_error) {
                            die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
                        }

                        // Perform the database insertion
                        $sql = "INSERT INTO users (name, number, address, building, flatNumber) VALUES ('$name', '$number', '$address','$building','$flatNumber')";

                        if ($conn->query($sql) === TRUE) {
                            echo json_encode(["success" => true]);
                        } else {
                            echo json_encode(["error" => $conn->error]);
                        }
                        $conn->close();
                    }
                    elseif(isset($data->orderData))
                    {
                        $order=$data->orderData;
                        $customernumber = $order->user_number; // Assuming you have a way to get the user ID
                        $orderMenu = json_encode($order->order);
                        $orderDate = date("Y-m-d H:i:s");
                        $totalBill = $order->total_bill;
                        $menutype=$order->menutype;
                       
                        // Insert the data into the database (replace with your actual database connection code)
                        $conn = createDatabaseConnection();
                    
                       
                        // Check connection
                        if ($conn->connect_error) {
                            die("Connection failed: " . $conn->connect_error);
                        }
                        // Get customer details
                        $getCustomerQuery = "SELECT name, number, address, building, flatNumber FROM users WHERE number = $customernumber";
                        $customerResult = $conn->query($getCustomerQuery);
                    
                        if ($customerResult->num_rows > 0) {
                            $customerData = $customerResult->fetch_assoc();
                            $customerName = $customerData['name'];
                            $customerNumber = $customerData['number'];
                            $customerAddress = $customerData['address'];
                            $customerBuildingName = $customerData['building'];
                            $customerFlatNumber = $customerData['flatNumber'];
                        } else {
                            // Handle the case where customer details are not found
                            $conn->close();
                            echo json_encode(["error" => "Customer details not found"]);
                            exit();
                        }
                    
                        // Insert the order into the database
                        $insertOrderQuery = "INSERT INTO orders (customer_name, customer_number, customer_address, customer_buildingName, customer_flatNumber, order_menu, order_date, menutype, total_bill) 
                                            VALUES ('$customerName', '$customerNumber', '$customerAddress', '$customerBuildingName', '$customerFlatNumber', '$orderMenu', '$orderDate','$menutype', $totalBill)";
                        // Get current pending amount
                        $getPendingAmountQuery = "SELECT pending_bill FROM users WHERE number = '$customerNumber'";
                        $pendingAmountResult = $conn->query($getPendingAmountQuery);

                        if ($pendingAmountResult->num_rows > 0) {
                        $pendingAmountData = $pendingAmountResult->fetch_assoc();
                        $currentPendingAmount = $pendingAmountData['pending_bill'];

                        }
                        $newPendingAmount = $currentPendingAmount + $totalBill;  // Assuming $totalBill is available
                        $updatePendingAmountQuery = "UPDATE users SET pending_bill = $newPendingAmount WHERE number = '$customerNumber'";
                        
                        if ($conn->query($insertOrderQuery) === TRUE) {
                            // Update the user's table with the new pending amount
                            if ($conn->query($updatePendingAmountQuery) === TRUE) {
                                echo json_encode(["success" => true]);
                            } else {
                                echo json_encode(["error" => $conn->error]);
                            }
                        } else {
                            echo json_encode(["error" => $conn->error]);
                        }

                        // Close the connection
                        $conn->close();
                    }   
                    elseif(isset($data->updateMenu))
                    {
                   
                        $menuData= $data->updateMenu;
                        $type=$menuData->Type;
                        $menu1=$menuData->Menu1;
                        $menu2=$menuData->Menu2;
                        // echo json_encode(["success" => $menu2]);
        
                        $conn = createDatabaseConnection();
                
                        // Check connection
                        if ($conn->connect_error) {
                            die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
                        }
                
                        // Perform the database update using prepared statement
                        $menuquery = $conn->prepare("UPDATE menu SET menuType = ?, menu1 = ?, menu2 = ? WHERE id = 0");
                
                        // Bind parameters
                        $menuquery->bind_param("sss", $type, $menu1, $menu2);
                
                        // Execute the update
                        if ($menuquery->execute()) {
                            echo json_encode(["success" => true]);
                        } else {
                            echo json_encode(["error" => $conn->error]);
                        }
                
                        // Close the prepared statement and connection
                        $menuquery->close();
                        $conn->close();
                    }
                    elseif(isset($data->billClear))
                    {
                        $billData= $data->billClear;
                        $userid=$billData->id;
                        //                             // echo json_encode(["success" => $menu2]);
                        
                        $conn = createDatabaseConnection();
                        
                        if ($conn->connect_error) {
                            die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
                        }
                        
                        
                        
                        // Perform the database update using prepared statement
                        $billquery = "UPDATE users SET pending_bill = 0 WHERE id = $userid";
                        
                        // Execute the update
                        if ($conn->query($billquery)) {
                            // echo json_encode(["success" => true]);
                            echo json_encode(['success'=> $userid]);
                        } else {
                            echo json_encode(["error" => $conn->error]);
                        }
                        
                        $conn->close();
                    
                    }
                    // Close the connection
                }
    }
    else {
        // Fetch menu items from the database
        $conn = createDatabaseConnection();
        // Fetch menu items from the database
        $query = "SELECT * FROM menu"; // Adjust the query based on your actual columns
        $result = $conn->query($query);

        if ($result->num_rows > 0) {
            // Fetch the first row (assuming there's only one row)
            $row = $result->fetch_assoc();

            // Return the values as a JSON response
            header('Content-Type: application/json');
            echo json_encode($row);
        } else {
            // Handle case where no rows are found
            echo json_encode(['error' => 'No menu items found']);
        }

        // Close the database connection
        $conn->close();
}
    // Function to create a database connection
function createDatabaseConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "hometiffinservice";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    return $conn;
}
?>
