import express from 'express';
import courseRoutes from './presentation_layer/routes/course.routes.js';

const app = express();
app.use(express.json());

app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;