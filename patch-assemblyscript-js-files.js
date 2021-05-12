const fs = require('fs');
const path = require('path');

readFiles('./libs/wasm-generated-js/src/lib', '', '.js');

function readFiles(basePath, dirName, pattern) {
    try {
        fs.readdir(`${basePath}/${dirName}`, (err, fileNames) => {
            if (err) {
                console.error(err);
                return;
            }
            fileNames.forEach((fileName) => {
                try {
                    const stat = fs.lstatSync(`${basePath}/${dirName}/${fileName}`);
                    if (stat.isDirectory()) {
                        readFiles(basePath, `${dirName}/${fileName}`, pattern);
                    } else {
                        if (`${basePath}/${dirName}/${fileName}`.includes(pattern)) {
                            readFile(basePath, `${dirName}/${fileName}`);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        });
    } catch (error) {
        console.log(error);
    }
}

function readFile(basePath, filePath) {
    try {
        fs.readFile(`${basePath}/${filePath}`, 'utf8', (err, data) => {
            if (err) {
                return console.log(err);
            }

            data = `
function idof(){return 0;};
function i32(x){return x;};
function unchecked(x){return x;};
${data}

                `;

            fs.writeFile(`${basePath}/${filePath}`, data, 'utf8', (err) => {
                if (err) return console.log(err);
            });
        });
    } catch (error) {
        console.log(error);
    }
}
