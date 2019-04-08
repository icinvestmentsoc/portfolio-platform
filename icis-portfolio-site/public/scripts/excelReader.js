/*
Found from https://github.com/SheetJS/js-xlsx/tree/master/demos/datagrid
*/

var X = XLSX;
var cDg;
var excelData;

var process_wb = (function() {
    return function process_wb(wb) {
        /* get data */
        var ws = wb.Sheets[wb.SheetNames[0]];
        var data = XLSX.utils.sheet_to_json(ws, {header:1});

        console.log(data);
        excelData = data;

        /**
         * Read the data!
         */
    };
})();

var do_file = (function() {
    return function do_file(files) {
        /* rABS = read as binary string*/ 
        rABS = true;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            if(typeof console !== 'undefined') console.log("onload", new Date(), rABS);
            var data = e.target.result;
            if(!rABS) data = new Uint8Array(data);
            process_wb(X.read(data, {type: rABS ? 'binary' : 'array'}));
        };
        if(rABS) reader.readAsBinaryString(f);
        else reader.readAsArrayBuffer(f);
    };
})();
(function() {
    var drop = document.getElementById('drop');
    if(!drop.addEventListener) return;
    function handleDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        do_file(e.dataTransfer.files);
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
(function() {
    var xlf = document.getElementById('xlf');
    if(!xlf.addEventListener) return;
    function handleFile(e) { do_file(e.target.files); }
    xlf.addEventListener('change', handleFile, false);
})();