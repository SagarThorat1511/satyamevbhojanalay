<?php
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
            $searchData=$data->search;
            $input=$searchData->input;
            
            $conn = createDatabaseConnection();
            
            // echo json_encode(['success'=>$input]);
                 // Check connection
                 if ($conn->connect_error) {
                    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
                }
                $query = "SELECT * FROM orders WHERE customer_name LIKE '$input' OR customer_number LIKE '$input' ORDER BY order_date DESC";

                // Execute the query
                $result = $conn->query($query);

                if ($result) {
                    $searchResults = $result->fetch_all(MYSQLI_ASSOC);
                    // Process search results as needed
                    echo json_encode(['searchResults' => $searchResults]);
                } else {
                    echo json_encode(["error" => "Error executing search query"]);
                }

            }
        }

            
    }

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