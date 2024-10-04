"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, compression_1.default)());
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const classificationResults = {};
fs_1.default.createReadStream(path_1.default.join(__dirname, '../Classification Results on Face Dataset (1000 images).csv'))
    .pipe((0, csv_parser_1.default)())
    .on('data', (data) => {
    classificationResults[data.Image] = data.Results;
})
    .on('end', () => {
    console.log('Loaded classification results.');
});
app.post('/', upload.single('inputFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (!req.file) {
            res.status(400).send('No file uploaded.');
            return resolve(); // Explicitly resolve the promise here
        }
        // Remove '.jpg' extension from uploaded file's name before lookup
        const filenameWithoutExt = req.file.originalname.replace('.jpg', '');
        const prediction = classificationResults[filenameWithoutExt] || 'Unknown';
        res.send(`${req.file.originalname}:${prediction}`);
        return resolve(); // Explicitly resolve after sending response
    });
}));
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
