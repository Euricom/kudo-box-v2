import dbConfigService from '../src/config/db-configurer.service';
import fs = require('fs');
import { join } from 'path';

require('dotenv').config({path: join(__dirname, '..', 'src', 'config', 'environment', '.prod.env') })

fs.writeFileSync(
    'ormconfig.json',
    JSON.stringify(dbConfigService.createTypeOrmOptions(), null, 2)
)