import application from './app';
import * as dotenv from 'dotenv';
const { parsed: env } = dotenv.config()

const port = env?.PORT || 1010;

const app = application.instance;

app.listen(port, () => console.log(`Tags from ${port}`));