/*globals $:false, document:false */

$(document).ready(function() {
    "use strict";
    
    // Modify this array to add new tabs for new authors
    var terms = ["Hemingway", "Dickens", "Shakespeare"];
    fetchData(terms);
});

/*
This function is used to fetch ebook data from iTunes API using Ajax requests.
It takes an array of terms (i.e. author last names in this case), and creates a
combined result: an object of objects.
*/
function fetchData(terms) {
    var dataObj = {},
        requests = [],
        curr;

    terms.forEach(function(term) {
        curr = $.ajax({
            url: "https://itunes.apple.com/search?country=gb&term=" + term + "&media=ebook&limit=10",
            data: {
                format: "json"
            },
            dataType: "jsonp",
            type: "GET",
            success: function(data) {
                dataObj[term] = data;
            }
        });
        requests.push(curr);
    });

    $.when.apply($, requests).done(function(results){
        generateHTMLContent(terms, dataObj);
    });
}


// Generates HTML DOM elements based on given data object
function generateHTMLContent(terms, dataObj) {
    var tabHTML = "<li id='%ID-tab'><a data-toggle='tab' href='#%TERM'>%TERM</a></li>",
        tabList = $("#tab-list");

    for (var i = 0; i < terms.length; i++) {
        tabHTML = tabHTML.replace("%ID", terms[i]);
        tabHTML = tabHTML.replace(new RegExp("%TERM", "g"), terms[i]);
        tabList.append(tabHTML);
        tabHTML = "<li id='%ID-tab'><a data-toggle='tab' href='#%TERM'>%TERM</a></li>";
    }

    generateTabContents(terms, dataObj);
}


// Generates content for each defined tab
function generateTabContents(terms, dataObj) {
    var tabHTML, tabContent, active;

    // For each term (i.e. author) in the combined data object...
    for (var term in dataObj) {
        if (dataObj.hasOwnProperty(term)) {

            // Create a new div
            tabHTML = "<div id='" + term + "' class='tab-pane fade'>";
            $("#content").append(tabHTML);

            // And populate that div with some table data
            tabContent = $("#" + term);
            tabContent.append(generateTableHTML(term, dataObj[term].results));
        }
    }

    activateTab(terms[0]);
}


// Generates table HTML according to the arr argument
function generateTableHTML(tableID, arr) {
    var tableHTML = "<table id = '" + tableID + "' class = 'table table-striped'>",
        headerRow = "<tr><th>Name</th><th>Description</th><th>Price</th>",
        rowHTML = "<tr><td><a href='%URL'>%NAME</a></td><td>%DESC</td><td>%PRICE</td>";

    tableHTML += headerRow;

    for (var i = 0; i < arr.length; i++) {
        rowHTML = rowHTML.replace("%URL", arr[i].trackViewUrl);
        rowHTML = rowHTML.replace("%NAME", arr[i].trackName);
        rowHTML = rowHTML.replace("%DESC", arr[i].description);
        rowHTML = rowHTML.replace("%PRICE", "£" + arr[i].price);
        tableHTML += rowHTML;
        rowHTML = "<tr><td><a href='%URL'>%NAME</a></td><td>%DESC</td><td>%PRICE</td>";
    }

    tableHTML += "</table>";
    return tableHTML;
}

// Activates given tab and its contents
function activateTab(tabID) {
    $("#" + tabID + "-tab").addClass("active");
    $("#content #" + tabID).addClass("in active");
}
