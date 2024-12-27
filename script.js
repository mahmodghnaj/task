$(document).ready(function () {
    // A. Read all data from the table
    function readTableData() {
        const tableData = [];
        $("table tbody tr").each(function () {
            const row = {
                id: $(this).find("th").text().trim(),
                firstName: $(this).find("td:eq(0)").text().trim(),
                lastName: $(this).find("td:eq(1)").text().trim(),
                year: $(this).find("td:eq(2)").text().trim(),
            };
            tableData.push(row);
        });
        return tableData;
    }

    // C. Display data in bottom section as accordions
    function displayDataAsAccordion(data) {
        const bottomSection = $(".bottom-data-section");
        bottomSection.empty();

        if (data.length === 0) {
            bottomSection.append('<p class="text-danger">No data to display.</p>');
            return;
        }

        data.forEach(row => {
            const accordionItem = `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading${row.id}">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${row.id}" aria-expanded="false" aria-controls="collapse${row.id}">
                            ${row.firstName} ${row.lastName}
                        </button>
                    </h2>
                    <div id="collapse${row.id}" class="accordion-collapse collapse" aria-labelledby="heading${row.id}">
                        <div class="accordion-body">
                            <strong>ID:</strong> ${row.id}<br>
                            <strong>First Name:</strong> ${row.firstName}<br>
                            <strong>Last Name:</strong> ${row.lastName}<br>
                            <strong>Year:</strong> ${row.year}
                        </div>
                    </div>
                </div>`;
            bottomSection.append(accordionItem);
        });
    }

    // D & E. Filters for bottom data section
    function applyFilters() {
        const columnFilter = $("input:eq(0)").val().toLowerCase().split(",").filter(Boolean);
        const nameFilter = $("input:eq(1)").val().toLowerCase();

        let filteredData = readTableData();

        if (columnFilter.length > 0 || nameFilter) {
            filteredData = filteredData.filter(row => {
                const columnMatch = columnFilter.length === 0 || columnFilter.some(filter => {
                    if (filter === "first") return row.firstName.toLowerCase().includes(nameFilter);
                    if (filter === "last") return row.lastName.toLowerCase().includes(nameFilter);
                    return false;
                });

                return columnMatch;
            });
        }

        displayDataAsAccordion(filteredData);
    }

    $("input").on("input", function () {
        applyFilters();
    });

    // F. Add custom button to calculate age column
    const customButton = $('<button class="btn btn-warning">Add Age Column</button>');
    customButton.insertBefore("table");

    customButton.on("click", function () {
        const currentYear = new Date().getFullYear();

        // Add age column header
        $("table thead tr").append('<th scope="col">Age</th>');
        $("table tbody tr").each(function () {
            const year = parseInt($(this).find("td:eq(2)").text().trim());
            const age = currentYear - year;
            $(this).append(`<td>${age}</td>`);
        });

        // Hide the button after adding the column
        $(this).hide();
    });

    // G. Update workflow with new table data
    $("table tbody").on("DOMSubtreeModified", function () {
        displayDataAsAccordion(readTableData());
    });

    // Initial rendering of bottom section
    displayDataAsAccordion(readTableData());
});
