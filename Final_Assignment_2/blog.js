$(function(){
    // find changes from get results function
    $('select').change(function() {
        getResults()
    });
});


function getResults(){
    
// Send updated settings 
    var parameters = {category: $('select[name="project"]').val()}
    //get parameters from the endpoint in the query
    $.get( '/process',parameters, function(data) {
        console.log(data)
        // the return data (hanlebars html) is added to the blogpost DIV.
        $('#blogpost').html(data)
    });
}

function init(){
    getResults()
}

init()
