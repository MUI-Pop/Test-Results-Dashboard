//Load Reports into datatable
$.get("/reports", function (data) {
    let arr = data;
    let table = document.createElement("table");
    table.setAttribute("id", "result-table");
    table.setAttribute("class", "display");

    //Form Header
    let header = table.appendChild(document.createElement("thead"));
    let headerRow = header.appendChild(document.createElement("tr"));

    let headerValues = ['Date', 'Pass Count', 'Fail Count', 'Skipped Count', 'Report']
    headerValues.forEach((value) => {
        let th = document.createElement('th');
        let text_node = document.createTextNode(value.toUpperCase());
        th.appendChild(text_node);
        headerRow.appendChild(th);
    });

    //Form Rows and Cells
    let tBody = table.appendChild(document.createElement("tbody"));
    for (let i = 0; i < arr.length; i++) {
        let tr = document.createElement('tr');
        Object.keys(arr[i]).forEach((key) => {
            if (key === 'id' || key == 'project_id')
                return;
            let cellText = arr[i][key];
            let td = document.createElement('td');
            if (key === 'reportpath') {
                let linkNode = document.createElement('a');
                linkNode.setAttribute('href', cellText);
                let text_node = document.createTextNode('Link');
                linkNode.appendChild(text_node);
                td.appendChild(linkNode);
            } else {
                let text_node = document.createTextNode(cellText);
                td.appendChild(text_node);
            }
            tr.appendChild(td);
        })
        tBody.appendChild(tr);
    }

    document.getElementById('table-content').appendChild(table);
    $('#result-table').DataTable();
}, "json");

//----------------------------------------------
// Open Upload modal
//---------------------------------------------
function openUploadModal() {
    document.getElementById('id01').style.display = 'block';

    //Load Release options
    let options = '<option value="" disabled selected>Select your the Project</option>';
    $.get('/settings/release', function (data, status) {
        for (var i = 0; i < data.length; i++) {
            options += '<option value="' + data[i].name + '" id="' + data[i].id + '">' + data[i].name + '</option>';
        }
        $("#release-release-dpdwn-modal").html(options);
    })
}

$("#release-release-dpdwn-modal").change(() => {
    let releaseId = $("#release-release-dpdwn-modal").find(":selected").attr('id')
    let options = '<option value="" disabled selected>Select the Project</option>';
    
    $.get('/settings/project', (data, status) => {
        let result = data;
        for (var i = 0; i < result.length; i++) {
            if( result[i].release_id == releaseId ){
                console.log(result[i].release_id)
                options += '<option value="' + result[i].name + '">' + result[i].name + '</option>';
            }
        }
        $("#project-release-dpdwn-modal").html(options);
    })
})

var modal = document.getElementById('id01');

// When clicked outside of modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

$("#upload-form").submit(function (e) {
    e.preventDefault();
    let url = "/report";
    let formData = new FormData($(this)[0]);

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
            if (JSON.parse(data).success === true) {
                $('#upload-submit').css('visibility', 'hidden');
                $('#upload-success').css('visibility', '');
                this.reset();
            }
        }
    });

    return false;
});

//-----------------------------
//Open Settings view
//-----------------------------
function switchViewToSettings(item) {
    document.getElementById('content-reports').style.visibility = 'hidden';
    document.getElementById('content-reports').style.display = 'none';
    document.getElementById('reports-nav').className = '';
    item.className = 'selected';
    document.getElementById('content-settings').style.visibility = '';
    document.getElementById('content-settings').style.display = '';
}

function switchViewToReports(item) {
    document.getElementById('content-settings').style.visibility = 'hidden';
    document.getElementById('content-settings').style.display = 'none';
    document.getElementById('settings-nav').className = '';
    item.className = 'selected';
    document.getElementById('content-reports').style.visibility = '';
    document.getElementById('content-reports').style.display = '';
}

//Accordion for settings tab
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    let text = acc[i].textContent;
    acc[i].onclick = function () {
        this.classList.toggle("active");
        if (text === 'Add Project') {
            let options = '<option value="" disabled selected>Select your the Project</option>';
            $.get('/settings/release', function (data, status) {
                for (var i = 0; i < data.length; i++) {
                    options += '<option value="' + data[i].name + '">' + data[i].name + '</option>';
                }
                $("#project-release-dpdwn").html(options);
            })
        }
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }
}

//
//Settings submit ajax actions
//
$("#report-settings").submit(function (e) {
    e.preventDefault();
    let url = "/settings/report";
    let formData = new FormData($(this)[0]);

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
            if (data.success === true) {
                console.log(data);
                $('#report-settings-submit').css({ 'visibility': 'hidden', 'display': 'none' });
                $('#report-settings-success').css('visibility', '');
                this.reset();
            }
        }
    });

    return false;
});

$("#project-settings").submit(function (e) {
    e.preventDefault();
    let url = "/settings/project";
    let formData = new FormData($(this)[0]);

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
            if (data.success === true) {
                console.log(data);
                $('#project-settings-submit').css({ 'visibility': 'hidden', 'display': 'none' });
                $('#project-settings-success').css('visibility', '');
                this.reset();
            }
        }
    });

    return false;
});

$("#release-settings").submit(function (e) {
    e.preventDefault();
    let url = "/settings/release";
    let formData = new FormData($(this)[0]);

    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
            if (data.success === true) {
                console.log(data);
                $('#release-settings-submit').css({ 'visibility': 'hidden', 'display': 'none' });
                $('#release-settings-success').css('visibility', '');
                this.reset();
            }
        }
    });

    return false;
});
