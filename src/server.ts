import application from './app';
import * as dotenv from 'dotenv';
dotenv.config()

const port = process?.env?.PORT || 3000;

const app = application.instance;

app.listen(port, () => console.log(`Master at ${port}`));