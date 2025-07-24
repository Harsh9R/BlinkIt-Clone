import userRouter from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import reviewRouter from './routes/review.routes.js';
const contactRoutes = require('./routes/contactRoutes');

// Routes
app.use('/api/user', userRouter);
app.use('/api/products', productRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api', contactRoutes); 