"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const app = (0, express_1.default)();
const port = 3000;
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const classificationResults = {};
fs_1.default.createReadStream('./data/Classification Results on Face Dataset (1000 images).csv')
    .pipe((0, csv_parser_1.default)())
    .on('data', (data) => {
    classificationResults[data.Image] = data.Results;
})
    .on('end', () => {
    console.log('Loaded classification results.');
});
app.post('/', upload.single('inputFile'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return; // Correctly handle the end of middleware execution
    }
    // Remove '.jpg' extension from uploaded file's name before lookup
    const filenameWithoutExt = req.file.originalname.replace('.jpg', '');
    const prediction = classificationResults[filenameWithoutExt] || 'Unknown';
    res.send(`${req.file.originalname}:${prediction}`);
    // Note: There is no `return res.send...` as this is not recommended
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
