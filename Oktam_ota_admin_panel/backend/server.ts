import 'dotenv/config';
import {createApp} from './src/backend/app.ts';
const port=Number(process.env.PORT || 3000);
createApp().listen(port,'0.0.0.0',()=>console.log(`Backend port ${port} da ishga tushdi`));
