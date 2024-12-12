$(document).ready(function() {
    let tableData = [
        {id: 1, name: "John Doe", email: "john.doe@example.com"},
        {id: 2, name: "Jane Smith", email: "jane.smith@example.com"},
        {id: 3, name: "Alice Johnson", email: "alice.johnson@example.com"}
    ];

    function displayTable(data) {
        const tableBody = $('#dynamic-table tbody');
        tableBody.empty();

        data.forEach(entry => {
            const row = `<tr data-id="${entry.id}">
                            <td>${entry.id}</td>
                            <td>${entry.name}</td>
                            <td>${entry.email}</td>
                            <td>
                                <button class="edit-btn btn">Edit</button>
                                <button class="delete-btn btn">Delete</button>
                            </td>
                        </tr>`;
            tableBody.append(row);
        });
    }
    displayTable(tableData);

    //Busqueda

    $('#search').on('input', function() { 
        const searchTerm = $(this).val().toLowerCase();
        const filteredData = tableData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.email.toLowerCase().includes(searchTerm)
        );
        displayTable(filteredData);
    });

//Agregar nuevo espacio

    $('#add-entry-btn').click(function() {
        $('#modal').removeClass('hidden');
        $('#modal-title').text('Add New Entry');
        $('#modal-name').val('');
        $('#modal-email').val('');
    });

    $(document).on('click', '.edit-btn', function() {
        const row = $(this).closest('tr');
        const id = row.data('id');
        const entry = tableData.find(item => item.id === id);
        
        $('#modal').removeClass('hidden');
        $('#modal-title').text('Edit Entry');
        $('#modal-name').val(entry.name);
        $('#modal-email').val(entry.email);
        $('#save-btn').data('id', id); 
    });

    //Save 

    $('#save-btn').click(function() {
        const id = $(this).data('id');
        const name = $('#modal-name').val();
        const email = $('#modal-email').val(); 

        if (!name || !email) {
            alert('Both fields are required!');
            return;
        }

        if (id) { //If Id exist, edit, if not creat a new 1
            const entry = tableData.find(item => item.id === id);
            entry.name = name;
            entry.email = email;
        } else { 
            const newId = tableData.length ? tableData[tableData.length - 1].id + 1 : 1;
            tableData.push({id: newId, name, email});
        }

        $('#modal').addClass('hidden');
        displayTable(tableData);
        showConfirmation('success', 'Entry saved successfully!');
    });

    $('#cancel-btn').click(function() {
        $('#modal').addClass('hidden');
    });

    $(document).on('click', '.delete-btn', function() { //remover
        const row = $(this).closest('tr');
        const id = row.data('id');
        tableData = tableData.filter(item => item.id !== id);
        row.remove();
        showConfirmation('success', 'Entry deleted successfully!');
    });

//funciones

    function showConfirmation(type, message) {
        const confirmation = $('#confirmation');
        confirmation.removeClass('hidden');
        confirmation.addClass(type === 'success' ? 'success' : 'fail');
        confirmation.text(message);

        setTimeout(() => {
            confirmation.addClass('hidden');
        }, 3000);
    }

    let sortOrder = {
        id: 'asc',
        name: 'asc',
        email: 'asc'
    };

    function sortTable(column) {
        const order = sortOrder[column] === 'asc' ? 'desc' : 'asc';
        sortOrder[column] = order;
        
        tableData.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];
            
            if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            if (order === 'asc') {
                return valA > valB ? 1 : (valA < valB ? -1 : 0);
            } else {
                return valA < valB ? 1 : (valA > valB ? -1 : 0);
            }
        });

        displayTable(tableData);
    }

    $('#dynamic-table th').on('click', function() {
        const column = $(this).data('column');
        sortTable(column);

        $('#dynamic-table th').removeClass('sort-asc sort-desc');
        $(this).addClass(sortOrder[column] === 'asc' ? 'sort-asc' : 'sort-desc');
    });

});
