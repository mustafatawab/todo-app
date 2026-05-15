import { app }  from './api';
import { env } from './src/shared/config/env';


app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});