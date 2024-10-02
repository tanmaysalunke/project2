import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

const app = express();
const port = 3000;

interface CsvRow {
    filename: string;
    prediction: string;
}

const upload = multer({ dest: 'uploads/' });

const classificationResults: Record<string, string> = {};

fs.createReadStream(path.join(__dirname, './data/Classification Results on Face Dataset (1000 images).csv'))
    .pipe(csv())
    .on('data', (data) => {
        classificationResults[data.Image] = data.Results;
    })
    .on('end', () => {
        console.log('Loaded classification results.');
    });

app.post('/', upload.single('inputFile'), (req: Request, res: Response) => {
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
