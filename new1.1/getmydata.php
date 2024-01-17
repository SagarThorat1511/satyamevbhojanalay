<?php
header('Content-Type: application/json');

// Include your database connection code here
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
// Function to get today's orders from the database
function getTodayOrders() {

    
    $conn = createDatabaseConnection();
     
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }
    $menuquery = "SELECT menutype FROM menu WHERE id = 0";
    $menuresult = $conn->query($menuquery);

    if ($menuresult) {
        $menutypeRow = $menuresult->fetch_assoc();

        if ($menutypeRow) {
             
            // Set the time zone to Asia/Kolkata
            date_default_timezone_set("Asia/Kolkata");

            // Get the current date
            $today = date("Y-m-d");

            // Define the time intervals for lunch and dinner
            $lunchStartTime = date("Y-m-d H:i:s", strtotime("yesterday 22:00:00"));
            $lunchEndTime = "$today 13:00:00";

            $dinnerStartTime = "$today 13:00:01";
            $dinnerEndTime = "$today 22:00:00";

            // If there is a row with id = 1
            $currentmenutype = $menutypeRow['menutype'];
            if($currentmenutype=='lunch'){

                // Fetch lunch orders
                $query = "SELECT * FROM orders WHERE order_date BETWEEN '$lunchStartTime' AND '$lunchEndTime' AND menutype = 'lunch' ORDER BY order_date DESC";
            }else{
                $query = "SELECT * FROM orders WHERE order_date BETWEEN '$dinnerStartTime' AND '$dinnerEndTime' AND menutype = 'dinner' ORDER BY order_date DESC";
                
            }
            
            $result = $conn->query($query);
        
            if ($result) {
                $todayOrders = $result->fetch_all(MYSQLI_ASSOC);
                return $todayOrders;
            } else {
                return false;
            }
        } else {
            // If no row is found with id = 1
            echo "No row found with id = 1";
        }
    } else {
        echo "Error fetching menutype";
    }
        $conn->close();
}
// Function to get order history from the database
function getOrder_history() {
    $conn = createDatabaseConnection();

    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    $query = "SELECT * FROM orders ORDER BY order_date DESC";

    $result = $conn->query($query);

    if ($result) {
        $orderHistory = $result->fetch_all(MYSQLI_ASSOC);
        return $orderHistory;
    } else {
        return false;
    }

    $conn->close();
}

// Function to get customer details from the database
function getCustomerDetails() {
    // Implement your database query to fetch customer details
    // Insert the data into the database (replace with your actual database connection code)
    
    // Create connection
    $conn = createDatabaseConnection();

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    $query = "SELECT * FROM users";
    $result = $conn->query($query);

    $customers = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
    }

    $conn->close();

    return $customers;
}
function getPendingBills() {
    $conn = createDatabaseConnection();

    if ($conn->connect_error) {
        die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
    }

    $query = "SELECT * FROM users WHERE pending_bill > 0";

    $result = $conn->query($query);

    if ($result) {
        $pendingBills = $result->fetch_all(MYSQLI_ASSOC);
        return $pendingBills;
    } else {
        return false;
    }

    $conn->close();
}

function search(){

}

// Check if a specific request is made
if (isset($_GET['action'])) {
    // Handle different actions
    switch ($_GET['action']) {
        case 'getTodayOrders':
            // Fetch today's orders
            $todayOrders = getTodayOrders();
            // Return the data as JSON
            echo json_encode(['todayOrders' => $todayOrders]);
            break;

        case 'getCustomerDetails':
            // Fetch customer details
            $customers = getCustomerDetails();
            // Return the data as JSON
            echo json_encode(['customers' => $customers]);
            break;

        case 'getOrders_history':
            $order_history = getOrder_history();
            echo json_encode(['order_history'=> $order_history]);
            break;
        case 'getPendingBills':
                // Fetch pending bills
                $pendingBills = getPendingBills();
                // Return the data as JSON
                echo json_encode(['pendingBills' => $pendingBills]);
                break;

        default:
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else {
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'POST') 
    {
        $data = file_get_contents("php://input");
                // Decode the JSON data
        $data = json_decode($data);
        if ($data === null) {
            // JSON decoding failed
            echo json_encode(["error" => "Invalid JSON data"]);
        } else {
            if(isset($data->search))
            {
                $searchData=$data->serach;
                $name=$searchData->name;
                $number=$searchData->number;
            }
        }

            
    }

    }
?>
