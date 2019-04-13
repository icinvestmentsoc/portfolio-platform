var currentData; // used to cache read Excel document

/**
 * @description Set listener to handle users inputting an Excel file
 * @returns null
 */
(function() {
    var xlf = document.getElementById('xlf');
    if (!xlf.addEventListener) return;
    function handleFile(e) { read_file(e.target.files); }
    xlf.addEventListener('change', handleFile, false);
})();

/**
 * @description Listener to handle users dropping the file into Input
 * @returns null
 */
(function() {
    var drop = document.getElementById('drop');
    if (!drop.addEventListener) return;

    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        read_file(e.dataTransfer.files);
    }

    function handleDragover(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    drop.addEventListener('dragenter', handleDragover, false);
    drop.addEventListener('dragover', handleDragover, false);
    drop.addEventListener('drop', handleDrop, false);
})();

/**
 * @name process_wb
 * @description Processes workbook, specifically first Worksheet
 * @param {Workbook} wb | Workbook object
 * @returns {Array[Transaction]} Array of transactions as object elements
 */
function process_wb(wb) {
    var ws = wb.Sheets[wb.SheetNames[0]];
    var json = XLSX.utils.sheet_to_json(ws, {header:1});
    var data = currentData = objectify_data(json);
    console.log(data);
    return data;
};

/**
 * @name read_file
 * @description Reads file and processes it
 * @param {Array[File]} files | Array of files (will always be 1)
 * @returns null
 */
function read_file(files) {
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = e.target.result;
        process_wb(XLSX.read(data, {type: 'binary'}));
    };
    reader.readAsBinaryString(files[0]);
};

/**
 * @name objectify_data
 * @description Turns Excel Data into element objects
 * @param {Array[Array]} csv | 2D array, containing rows of transactions
 * @returns {Array[Transaction]} Array of transactions as object elements
 */
function objectify_data(csv) {
    var format = ["trxid", "symbol", "date", "units", "price", "bought"];
    // Note: could add flexibility later on for different order of headers
    return csv.slice(1).map(trans => objectify_row(format, trans));
}

/**
 * @name objectify_row
 * @description Turns row of Transaction data into element objects
 * @param {Array[String]} format | Object keys that correlate each list elem represents
 * @param {Array[String]} trans | Transaction data
 * @returns {Object} Transaction object, keys matched with their respective value
 */
function objectify_row(format, trans) {
    var obj = new Object();
    for (var i in format) {
        obj[format[i]] = trans[i];
    }
    return obj;
}

/**
 * @name send_data
 * @description 
 * @param 
 * @param 
 * @returns 
 */
function send_data() {
    // get the currentData element
    // don't send anything if empty
    
    // if it isn't, then POST

    if (typeof currentData === 'undefined') return;

    $.post("/excelInput", {
        data: JSON.stringify(currentData)
    }, (err, msg) => {
        console.log(err);
        console.log(msg);
    });
}