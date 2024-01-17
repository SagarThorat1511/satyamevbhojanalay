const items = [];
const savedUserInfo = localStorage.getItem('userDetails');
if (savedUserInfo) {
    const userInfo = JSON.parse(savedUserInfo);
    document.getElementById('initialName').value = userInfo.name;
    document.getElementById('initialNumber').value = userInfo.number;
    document.getElementById('initialAddress').value = userInfo.address;
    document.getElementById('initialBuilding').value = userInfo.building;
    document.getElementById('initialFlat').value = userInfo.flat;
}

// Add a function to show the initial form when the page loads
window.onload = function () {
    
     getSavedDetails(); 
};
function getSavedDetails() {
    const savedDetails = localStorage.getItem('userDetails');
    const savedDetailsJson = JSON.parse(savedDetails);
    // const savedDetailsJson = {
    //     number:9021446855
    // }
    fetch('verifyUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedDetailsJson),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.data) {
                const title_menutype=document.getElementById('title');
                const menutype=data.data.menuType;
                const name =data.data.name;
                title_menutype.innerHTML=`Hello <span class="heighlight">${name}</span> welcome to Home Tiffin Service Order for <span class="heighlight" id="menutype">${menutype}</span>`;
        } else {
            // alert("user not found");

            showInitialFormModal();
        }
    })
    .catch(error => {
        console.error('Error verifying user:', error);
    });
}
function showInitialFormModal() {
    const initialFormModal = document.getElementById('initialFormModal');
    initialFormModal.style.display = 'block';
}

// Function to validate and submit the form
function validateAndSubmitForm() {
    const name = document.getElementById('initialName').value;
    const number = document.getElementById('initialNumber').value;
    const address = document.getElementById('initialAddress').value;
    const flat = document.getElementById('initialFlat').value;
    const building = document.getElementById('initialBuilding').value;

    // Reset previous validation styles
    resetValidationStyles();

    // Validate each field
    let isValid = true;

    if (!name.trim()) {
        isValid = false;
        markInvalidField('initialName', 'Please enter a valid name.');
    }

    if (!/^\d{10}$/.test(number)) {
        isValid = false;
        markInvalidField('initialNumber', 'Please enter a 10-digit valid number.');
    }

    if (!address.trim()) {
        isValid = false;
        markInvalidField('initialAddress', 'Please enter a valid address.');
    }

    if (!flat.trim()) {
        isValid = false;
        markInvalidField('initialFlat', 'Please enter a valid flat number.');
    }

    if (!building.trim()) {
        isValid = false;
        markInvalidField('initialBuilding', 'Please enter a valid building name.');
    }

    // If all fields are valid, submit the form
    if (isValid) {
        const details = {
            name: name,
            number: number,
            address: address,
            flat: flat,
            building: building,
        };
        localStorage.setItem('userDetails', JSON.stringify(details));
       
        // console.log(details);
        registerUser();
        closeInitialFormModal();
    }
}

// Function to mark an input field as invalid and display an error message
function markInvalidField(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    field.classList.add('invalid-field');
    alert(errorMessage); // You can replace this with a more user-friendly approach, such as displaying a message near the field.
}

// Function to reset validation styles
function resetValidationStyles() {
    const fields = ['initialName', 'initialNumber', 'initialAddress', 'initialFlat', 'initialBuilding'];

    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        field.classList.remove('invalid-field');
    });
}

// Call the validateAndSubmitForm function when attempting to submit the form
document.getElementById('submitButton').addEventListener('click', validateAndSubmitForm);



function closeInitialFormModal() {
    const initialFormModal = document.getElementById('initialFormModal');
    initialFormModal.style.display = 'none';
}
function registerUser() {
    const userData = {
        name: document.getElementById('initialName').value,
        number: document.getElementById('initialNumber').value,
        address: document.getElementById('initialAddress').value,
        building: document.getElementById('initialBuilding').value,
        flatNumber: document.getElementById('initialFlat').value,
        
    };
    fetch('backend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userData:userData}),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('For Now We are In Development Process ! We will be in your service as soon as possible');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("User registered successfully!");
            location.reload();

        } else {
            alert(" Error Registering user1: For Now We are In Development Process ! We will be in your service as soon as possible");
        }
    })
    .catch(error => {
        alert("Error Registering user2: For Now We are In Development Process ! We will be in your service as soon as possible");
    });

}

function costumizeSelect(itemName)
{   
    if(itemName=='bottle'){

        const selectQuantity=document.getElementById(`${itemName}`);
        selectQuantity.style.display = "block";
        const quantity=document.getElementById(`${itemName}-quantity`);
        quantity.value=1;
        const addBtn=document.getElementById(`${itemName}-select`);
        addBtn.style.display='none';
    }
    else{
        showcustomizationModal(itemName);
    }
}
function showcustomizationModal(itemName){
    

    const customizationModal =document.getElementById('customizationModal');
    customizationModal.style.display='block';
    if(itemName=="half-rice-plate" || itemName=="full-rice-plate"){
        fetch('backend.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching menu');
            }
            return response.json();
        })
        .then(menuItems => {
            // Call a function to display the menu items on the page
            customizationModal.innerHTML=`<div class="modal-content">
            <span class="close" onclick="closecustomizationModal()">&times;</span>
            <h2>Customize Your Item</h2>
            <form id="customizationForm-${itemName}">
            <label>
            <input type="radio" name="${itemName}-option" value="${menuItems.menu1}"> ${menuItems.menu1}
            </label>
            <br>
            <label>
            <input type="radio" name="${itemName}-option" value="${menuItems.menu2}"> ${menuItems.menu2}
            </label>
            <br>
            <button type="button" onclick="applycustomizationModal('${itemName}')">Save</button>
            </form>
            </div>`;
    
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
       
    }
    else if(itemName=='chapati'){
        
        customizationModal.innerHTML=`<div class="modal-content">
        <span class="close" onclick="closecustomizationModal()">&times;</span>
        <h2>Customize Your Item</h2>
        <form id="customizationForm-${itemName}">
        <label>
        <input type="radio" name="${itemName}-option" value="oil"> Oil
        </label>
        <br>
        <label>
        <input type="radio" name="${itemName}-option" value="without-oil"> Without Oil
        </label>
        <br>
        <button type="button" onclick="applycustomizationModal('${itemName}')">Save</button>
        </form>
        </div>`
    }
    else if(itemName="Add-On"){
        const addOnCustomizationModal =document.getElementById('addOnCustomizationModal');
        addOnCustomizationModal.style.display='block';
        fetch('backend.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching menu');
            }
            return response.json();
        })
        .then(menuItems => {
           document.getElementById('menu1title').innerHTML=`${menuItems.menu1}`;
           document.getElementById('menu2title').innerHTML=`${menuItems.menu2}`;
           document.getElementById('subji1-customization').value=`${menuItems.menu1}`;
           document.getElementById('subji2-customization').value=`${menuItems.menu2}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    else{
        return none;
    }
}
function closecustomizationModal(){
    const customizationModal =document.getElementById('customizationModal');
    customizationModal.style.display='none';
    const addOnCustomizationModal =document.getElementById('addOnCustomizationModal');
    addOnCustomizationModal.style.display='none';
    
}
function applycustomizationModal(itemName){
    if (itemName==="Add-On") {
        const subji1Quantity = document.getElementById('subji1-quantity').value;
        const subji1Customization=document.getElementById('subji1-customization').value;
        const subji2Quantity = document.getElementById('subji2-quantity').value;
        const subji2Customization=document.getElementById('subji2-customization').value;
        const riceQuantity = document.getElementById('rice-quantity').value;
        const dalQuantity = document.getElementById('dal-quantity').value;
        if(subji1Quantity>0 || subji2Quantity>0 || riceQuantity>0 || dalQuantity>0){
        // alert(itemName)
        closecustomizationModal();
        const selectQuantity=document.getElementById(`${itemName}`);
        selectQuantity.style.display = "block";
        selectQuantity.innerHTML=`<h3>${subji1Customization} x ${subji1Quantity}</h3>
        <h3>${subji2Customization} x ${subji2Quantity}</h3>
        <h3>Rice x ${riceQuantity}</h3>
        <h3>Dal x ${dalQuantity}</h3>
        <button class="add-on-btn" onclick="costumizeSelect('Add-On')">Edit</button>`;
        const addBtn=document.getElementById(`${itemName}-select`);
        addBtn.style.display='none';
    }
    else{
        alert("please Select atleast One Add-On!")
    }

    } else {
        
        var selectedOption = document.querySelector(`input[name="${itemName}-option"]:checked`);
        
        if(selectedOption){
            
            const full_subji=document.getElementById(`${itemName}-selected`);
            full_subji.innerHTML=`${selectedOption.value}`;
            closecustomizationModal();
            
            const selectQuantity=document.getElementById(`${itemName}`);
            selectQuantity.style.display = "block";
            const quantity=document.getElementById(`${itemName}-quantity`);
            quantity.value=1;
            const addBtn=document.getElementById(`${itemName}-select`);
            addBtn.style.display='none';
        }
        else {
            alert("please Select option!")
        }
    }
}
function increaseQuantity(itemName){
    const quantity = document.getElementById(`${itemName}-quantity`)
    if (quantity) {
        let currentValue = parseInt(quantity.value, 10);
        quantity.value = currentValue + 1;
    }
}
function decreaseQuantity(itemName) {
    const quantity = document.getElementById(`${itemName}-quantity`);
    if (quantity) {
        let currentValue = parseInt(quantity.value, 10);
        if (currentValue > 0) {
            quantity.value = currentValue - 1;
        }
    }
}


function placeOrder() {
    // Gather selected items, quantities, and customizations
    
   
    // Full Rice Plate
    const fullRicePlateQuantity = document.getElementById('full-rice-plate-quantity').value;
    const fullRicePlateSubji = document.getElementById('full-rice-plate-selected').innerHTML;
    if(fullRicePlateQuantity>0){
        items.push({
            name: 'Full Rice Plate',
            quantity: fullRicePlateQuantity,
            subji: fullRicePlateSubji
        });
    }
    // Half Rice Plate
    const halfRicePlateQuantity = document.getElementById('half-rice-plate-quantity').value;
    const halfRicePlateSubji = document.getElementById('half-rice-plate-selected').innerHTML;
    if(halfRicePlateQuantity>0){
        items.push({
            name: 'Half Rice Plate',
            quantity: halfRicePlateQuantity,
            subji: halfRicePlateSubji
        });
    }
    // Chapati
    const chapatiQuantity = document.getElementById('chapati-quantity').value;
    const chapatiCustomization = document.getElementById('chapati-selected').innerHTML;
    if(chapatiQuantity>0){
        items.push({
            name: 'Chapati',
            quantity: chapatiQuantity,
            customization: chapatiCustomization
        });
    }
    const extraSubji1Quantity = document.getElementById('subji1-quantity').value;
    const extraSubji1Customization=document.getElementById('subji1-customization').value;
    if(extraSubji1Quantity>0){
        items.push({
            name: "Extra-Subji",
            quantity: extraSubji1Quantity,
            customization:extraSubji1Customization
        });
    }
        const extraSubji2Quantity = document.getElementById('subji2-quantity').value;
        const extraSubji2Customization=document.getElementById('subji2-customization').value;
        if(extraSubji2Quantity>0){
            items.push({
                name: "Extra-Subji",
                quantity: extraSubji2Quantity,
                customization:extraSubji2Customization
            });
    }
    const extrariceQuantity = document.getElementById('rice-quantity').value;
    if(extrariceQuantity>0){
        items.push({
            name: "Rice",
            quantity: extrariceQuantity,
        });
    }
    const extradalQuantity = document.getElementById('dal-quantity').value;
    if(extradalQuantity>0){
        items.push({
            name: "Dal",
            quantity: extradalQuantity,
        });
    }
        // Display confirmation modal
    showConfirmationModal(items);
}
function showConfirmationModal(items) {
    if (items.length > 0) {
        const confirmationModal = document.getElementById('confirmationModal');
        const modalContent = document.getElementById('modalContent');

        // Clear previous content
        modalContent.innerHTML = '';

        // Initialize total bill
        let totalBill = 0;

        // Prices for each item
        const itemPrices = {
            'Full Rice Plate': 80,
            'Half Rice Plate': 60,
            'Chapati': 10,
            'Extra-Subji': 30,
            'Rice':20,
            'Dal':20
            // Add more items and prices as needed
        };

        // Populate modal with order details
        items.forEach(item => {
            const itemPrice = itemPrices[item.name] || 0; // Get the price for the item or default to 0
            const itemTotal = itemPrice * item.quantity;

            modalContent.innerHTML += `<p>${item.quantity}x ${item.name} ${item.subji ? `- ${item.subji}` : ''} ${item.customization ? `- ${item.customization}` : ''} - Rs. ${itemTotal}</p>`;
            // modalContent.innerHTML+="<br><br><hr>"
            // Add the total for the item to the overall total
            totalBill += itemTotal;
        });

        // Display total bill
        modalContent.innerHTML += `<hr><p>Total Bill: Rs. ${totalBill}</p>`;

        // Add buttons to confirm or cancel the order
        modalContent.innerHTML += `
            <button onclick="confirmOrder()">Confirm</button>
            <button onclick="cancelOrder()">Cancel</button>
        `;

        // Show the confirmation modal
        confirmationModal.style.display = 'block';
    } else {
        alert("Select something before placing the order");
    }
}


function confirmOrder() {
    const name = document.getElementById('initialName').value;
    const number = document.getElementById('initialNumber').value;
    const address = document.getElementById('initialAddress').value;
    const building = document.getElementById('initialBuilding').value;
    const flatNumber = document.getElementById('initialFlat').value;
    const menuType=document.getElementById("menutype").innerHTML;
    const orderDetails = items;

    const userInfo = {
        name: name,
        number: number,
        address: address,
        building: building,
        flatNumber: flatNumber,
    };
    localStorage.setItem('userDetails', JSON.stringify(userInfo));

    const orderData = {
        user_number: number,  // Ensure the correct field name is used
        order: orderDetails,
        menutype:menuType,
        total_bill: calculateTotalBill(items), // You need a function to calculate the total bill
    };
    fetch('backend.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({orderData:orderData}),
    })
    .then(response => {
 
        if (!response.ok) {
        throw new Error('For Now We are In Development Process ! We will be in your service as soon as possible');
    }
    return response.json();
    })
    .then(data => {
        if (data.success) {
            alert("Order placed successfully!");
            // Reset the quantity inputs, selected item display, etc.
            resetOrderForm();
        } else {
            alert("For Now We are In Development Process ! We will be in your service as soon as possible");
        }
    })
    .catch(error => {
        console.log(error);
            alert("For Now We are In Development Process ! We will be in your service as soon as possible");  // Display the error message
        
    });
    
}

function resetOrderForm() {
    // Reset the quantity inputs
    document.getElementById('full-rice-plate-quantity').value = 0;
    document.getElementById('half-rice-plate-quantity').value = 0;
    document.getElementById('chapati-quantity').value = 0;
    document.getElementById('subji1-quantity').value=0;
    document.getElementById('subji2-quantity').value=0;
    document.getElementById('rice-quantity').value=0;
    document.getElementById('dal-quantity').value=0;

    // Reset the selected item display
    document.getElementById('full-rice-plate-selected').innerHTML = '';
    document.getElementById('half-rice-plate-selected').innerHTML = '';
    document.getElementById('chapati-selected').innerHTML = '';
    document.getElementById('subji2-customization').value='';
    document.getElementById('subji1-customization').value='';
    // Show the add buttons and hide the quantity inputs
    showAddButtons();

    // Reset the order array for the next order
    items.length = 0;

    // Close the confirmation modal
    closeConfirmationModal();
}
function calculateTotalBill(orderDetails) {
    const prices = {
        'Full Rice Plate': 80,
        'Half Rice Plate': 60,
        'Chapati': 10,
        'Extra-Subji': 30,
        'Rice':20,
        'Dal':20
    };

    let totalBill = 0;

    orderDetails.forEach(item => {
        const itemName = item.name;
        const quantity = parseInt(item.quantity, 10) || 0;

        if (prices.hasOwnProperty(itemName)) {
            totalBill += prices[itemName] * quantity;
        }
    });

    return totalBill;
}

function showAddButtons() {
    const items = ['full-rice-plate', 'half-rice-plate', 'chapati', 'Add-On'];

    items.forEach(item => {
        const quantityInput = document.getElementById(`${item}`);
        const addBtn = document.getElementById(`${item}-select`);

        if (quantityInput && addBtn) {
            quantityInput.style.display = 'none';
            addBtn.style.display = 'block';
        }
    });
}
function cancelOrder() {
    resetOrderForm();
    closeConfirmationModal();
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.display = 'none';
}
