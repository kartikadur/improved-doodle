import { app } from './app.js';
import { db } from './routes/event.js'

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on localhost:${port}`)
})
