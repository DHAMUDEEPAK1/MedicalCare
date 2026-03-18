import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend connected successfully!' });
});

app.get('/api/doctors', (req, res) => {
    res.json([
        { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' },
        { id: 2, name: 'Dr. Adams', specialty: 'Pediatrics' }
    ]);
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
