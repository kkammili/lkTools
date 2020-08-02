const fs = require('fs')
fs.writeFile('file.txt', '1', (err) => {
    if(err) {
        throw err;
    }
    console.log("Data has been written to file successfully.");
});