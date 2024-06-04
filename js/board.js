function toggleAssignedDropdown() {
    const dropdown = document.getElementById('dropdownAssigned');    
    let icon = document.getElementById('assignedDropdownArrow');   
    
        if (dropdown.style.display === 'flex') {            
            dropdown.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';        
        } else {
            dropdown.style.display = 'flex';            
            icon.style.transform = 'rotate(180deg)';
            
        }
    
}

function toggleCategoryDropdown() {
    const dropdown = document.getElementById('dropdownCategory');    
    let icon = document.getElementById('categoryDropdownArrow');   
    
        if (dropdown.style.display === 'flex') {            
            dropdown.style.display = 'none';
            icon.style.transform = 'rotate(0deg)';        
        } else {
            dropdown.style.display = 'flex';            
            icon.style.transform = 'rotate(180deg)';
            
        }
    
}

