import express, { Request, Response } from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import compression from 'compression';

const app = express();
const port = 3000;

app.use(compression());

interface CsvRow {
    filename: string;
    prediction: string;
}

const upload = multer({ dest: 'uploads/' });

const classificationResults: Record<string, string> = {};

fs.createReadStream(path.join(__dirname, '../Classification Results on Face Dataset (1000 images).csv'))
    .pipe(csv())
    .on('data', (data) => {
        classificationResults[data.Image] = data.Results;
    })
    .on('end', () => {
        console.log('Loaded classification results.');
    });

    app.post('/', upload.single('inputFile'), async (req: Request, res: Response): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!req.file) {
                res.status(400).send('No file uploaded.');
                return resolve(); // Explicitly resolve the promise here
            }
    
            // Remove '.jpg' extension from uploaded file's name before lookup
            const filenameWithoutExt = req.file.originalname.replace('.jpg', '');
            const prediction: string = classificationResults[filenameWithoutExt] || 'Unknown';
    
            res.send(`${req.file.originalname}:${prediction}`);
            return resolve();  // Explicitly resolve after sending response
        });
    });


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
