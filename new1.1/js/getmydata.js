if (localStorage.getItem('admin_authenticated') !== 'true') {
        window.location.href = 'login.html';
} 
function logout() {
    localStorage.removeItem('admin_authenticated');
    window.location.href='login.html';
}
var tab='todays_orders';
function print(){
    loadContent(tab);
}

setInterval(print, 4000);

// updateMenu();
function loadContent(tabname){
    tab=tabname;
     // Remove 'active' class from all tabs
     document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add 'active' class to the clicked tab
    document.getElementById(tabname).classList.add('active');

    const main_content=document.getElementById('main-content');
    const li_active=document.querySelector('.sidebar li');
    li_active.style="background-color:red;";
    if(tabname==='todays_orders'){
        fetch('getmydata.php?action=getTodayOrders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching menu');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            const reversedOrders = data.todayOrders;
            // Get the table element
            const table = document.querySelector('#displayTable');
            // Define the header column names
            const headerColumns = [
                    'ID',
                    'Name',
                    'Number',
                    'Address',
                    'Building Name',
                    'Flat Number',
                    'Order Menu',
                    'Order Date',
                    'Type',
                    'Total Bill',
                    'Action'
            ];
            // Populate the table header dynamically
            populateTableHeader(table,headerColumns);
            // Get the table body element
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML='';
            // Iterate through the reversed orders and create table rows
            reversedOrders.forEach(order => {
                // Create a table row
                const row = document.createElement('tr');

                // Add table cells with order details
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.customer_number}</td>
                    <td>${order.customer_address}</td>
                    <td>${order.customer_buildingName}</td>
                    <td>${order.customer_flatNumber}</td>
                    <td>${generateOrderMenuTable(order.order_menu)}</td>
                    <td>${order.order_date}</td>
                    <td>${order.menutype}</td>
                    <td>${order.total_bill}</td>
                    <td><button onclick="printOrder(${order.id})">Print</button></td>
                           
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error fetching today\'s orders: ', error);
        });        
    }
    else if(tabname==='orders_history'){
        fetch('getmydata.php?action=getOrders_history')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching menu');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            const reversedOrders = data.order_history;
            // Get the table element
            const table = document.querySelector('#displayTable');
            // Define the header column names
            const headerColumns = [
                    'ID',
                    'Name',
                    'Number',
                    'Address',
                    'Name',
                    'Flat NO.',
                    'Order',
                    'Date',
                    'Type',
                    'Bill',
                    
            ];
            // Populate the table header dynamically
            populateTableHeader(table,headerColumns);
            // Get the table body element
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML='';
            // Iterate through the reversed orders and create table rows
            reversedOrders.forEach(order => {
                // Create a table row
                const row = document.createElement('tr');

                // Add table cells with order details
                row.innerHTML = `
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.customer_number}</td>
                    <td>${order.customer_address}</td>
                    <td>${order.customer_buildingName}</td>
                    <td>${order.customer_flatNumber}</td>
                    <td>${generateOrderMenuTable(order.order_menu)}</td>
                    <td>${order.order_date}</td>
                    <td>${order.menutype}</td>
                    <td>${order.total_bill}</td>
                           
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });

        })
        .catch(error => {
            console.error('Error fetching orders: ', error);
        });
    }
    else if(tabname==='customers'){
        fetch('getmydata.php?action=getCustomerDetails')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching customer details');
            }
            return response.json();
        })
        .then(data => {
            // Handle customer details data
            const customers = data.customers;

            // Get the customer table element
            const customerTable = document.querySelector('#displayTable');
            
            // Define the header column names
            const headerColumns = [
                'ID',
                'Name',
                'Number',
                'Address',
                'Building',
                'Flat Number',
                'Pending Bill'
            ];

            // Populate the table header dynamically
            populateTableHeader(customerTable, headerColumns);

            // Get the table body element
            const tableBody = customerTable.querySelector('tbody');

            // Clear existing content of the table body
            tableBody.innerHTML = '';

            // Iterate through the customers and create table rows
            customers.forEach(customer => {
                // Create a table row
                const row = document.createElement('tr');

                // Add table cells with customer details
                row.innerHTML = `
                    <td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.number}</td>
                    <td>${customer.address}</td>
                    <td>${customer.building}</td>
                    <td>${customer.flatNumber}</td>
                    <td>${customer.pending_bill}</td>
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching customer details: ', error);
        });
    }
    else if(tabname==='pending_bills'){
        fetch('getmydata.php?action=getPendingBills')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching pending bills');
            }
            return response.json();
        })
        .then(data => {
            // Handle pending bill details data
            const pendingBills = data.pendingBills;

            // Get the pending bills table element
            const pendingBillsTable = document.querySelector('#displayTable');

            // Define the header column names
            const headerColumns = [
                'ID',
                'Customer Name',
                'Customer Number',
                'Pending Bill',
                'action'
            ];

            // Populate the table header dynamically
            populateTableHeader(pendingBillsTable, headerColumns);

            // Get the table body element
            const tableBody = pendingBillsTable.querySelector('tbody');

            // Clear existing content of the table body
            tableBody.innerHTML = '';

            // Iterate through the pending bills and create table rows
            pendingBills.forEach(pendingBill => {
                // Create a table row
                const row = document.createElement('tr');

                // Add table cells with pending bill details
                row.innerHTML = `
                    <td>${pendingBill.id}</td>
                    <td>${pendingBill.name}</td>
                    <td>${pendingBill.number}</td>
                    <td>${pendingBill.pending_bill}</td>
                    <td><button onclick="clearBill(${pendingBill.id})">Clear Bills</button></td>
                `;

                // Append the row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching pending bills: ', error);
        });
    }
}
// Function to populate the table header dynamically
function populateTableHeader(table,headerColumns) {
    const updatemenu=document.getElementById("updatemenu");
    const main_content=document.getElementById("main-content");
    main_content.style='display:block;';
    updatemenu.style='display:none;';
    const thead = table.querySelector('thead');
     thead.innerHTML = '';
    const headerRow = document.createElement('tr');

    // Create header cells and add them to the row
    headerColumns.forEach(column => {
        const cell = document.createElement('th');
        cell.textContent = column;
        headerRow.appendChild(cell);
    });

    // Append the header row to the thead
    thead.appendChild(headerRow);
}

// Function to convert order menu JSON string to HTML table
function generateOrderMenuTable(orderMenu) {
    const menuItems = JSON.parse(orderMenu);
    let tableHTML = '<table class="menu">';
    tableHTML.id = 'menu';
    menuItems.forEach(item => {
        tableHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.subji || item.customization || ''}</td></tr>`;
    });
    tableHTML += '</table>';
    return tableHTML;
}
function printOrder(id){
    console.log(id);

}
function clearBill(C_id){

        const userid={
            id:C_id
        };
        // User clicked OK, perform the action to clear the bill
        fetch('backend.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({billClear:userid}),
        })
        .then(response => { 
            if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // console.log(response);
        return response.json();
        })
        .then(data => {
           console.log(data);
            if (data.success) {
                alert("successfully clear bill!");
            } else {
                console.log(data);
                alert("Error Clearing Bill. Please try again.");
            }
        })
        .catch(error => {
    
           console.error('Error Clearing Bill:', error);
                alert("Error Clearing Bill: " + error.message);  // Display the error message
            
        });
}


function updateMenu(){
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add 'active' class to the 'Update Menu' tab
    document.getElementById('updateMenu').classList.add('active');
    
    tab='updataMenu'
    const updatemenu=document.getElementById("updatemenu");
    const main_content=document.getElementById("main-content");
    main_content.style='display:none;';
    updatemenu.style='display:block;';
}
  
function menu(type,menu1,menu2){
    const menu={
        Type:type,
        Menu1:menu1,
        Menu2:menu2
    }
    fetch('backend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({updateMenu:menu}),
    })
    .then(response => { 
        if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // console.log(response);
    return response.json();
    })
    .then(data => {
       console.log(data);
        if (data.success) {
            alert("successfully!");
        } else {
            console.log(data);
            alert("Error updating menu. Please try again.");
        }
    })
    .catch(error => {

       console.error('Error Updating menu:', error);
            alert("Error updating menu: " + error.message);  // Display the error message
        
    });
}

function search(){
    const searchData=document.getElementById('search-input').value;
    const search={
        input:searchData,
    }
   
    fetch('demo.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({search:search}),
    })
    .then(response => { 
        if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    // console.log(response);
    return response.json();
    })
    .then(data => {
       console.log(data);
       console.log(data.searchResults);
       // console.log(data);
       const reversedOrders = data.searchResults;
       // Get the table element
       const main_content=document.getElementById("displayTable");
        main_content.style='display:none;';
       const table = document.querySelector('#searchdisplayTable');
       // Define the header column names
       const headerColumns = [
               'ID',
               'Name',
               'Number',
               'Address',
               'Name',
               'Flat NO.',
               'Order',
               'Date',
               'Type',
               'Bill',
               
       ];
       // Populate the table header dynamically
       populateTableHeader(table,headerColumns);
       // Get the table body element
       const tableBody = table.querySelector('tbody');
       tableBody.innerHTML='';
       // Iterate through the reversed orders and create table rows
       reversedOrders.forEach(order => {
           // Create a table row
           const row = document.createElement('tr');

           // Add table cells with order details
           row.innerHTML = `
               <td>${order.id}</td>
               <td>${order.customer_name}</td>
               <td>${order.customer_number}</td>
               <td>${order.customer_address}</td>
               <td>${order.customer_buildingName}</td>
               <td>${order.customer_flatNumber}</td>
               <td>${generateOrderMenuTable(order.order_menu)}</td>
               <td>${order.order_date}</td>
               <td>${order.menutype}</td>
               <td>${order.total_bill}</td>
                      
           `;

           // Append the row to the table body
           tableBody.appendChild(row);
       });

   })
    .catch(error => {

       console.error('Error Updating menu:', error);
            alert("Error updating menu: " + error.message);  // Display the error message
        
    });
}