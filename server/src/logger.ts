import 'dotenv/config'
import pino from 'pino'

export default pino({
    enabled: true,
    level: 'info'
});