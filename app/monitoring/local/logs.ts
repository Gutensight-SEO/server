/** @format */


import log from 'pino';
import dayjs from 'dayjs';
import colors from 'colors';


colors.enable();


const LocalLogs = log({
    base: {
        pid: false,
    },
    timestamp: () => `, "time": "${dayjs().format()}"`,
})

const Logs = {
    error(title: string, message: any) {
        console.error(`${title}`.bgRed, `${message}`.bgRed);
        // console.error(message?.message)
        LocalLogs.error(title, message);
    },
    group(title: string, message: any) {
        console.group();
        console.groupCollapsed(`==================================`.bgWhite);
        console.group(title, message);
        // console.group(`${message}`.bgBlack);
        console.groupCollapsed(`==================================`.bgWhite);
        console.groupEnd();
    },
    info(title: string, message: any) {
        // console.info(title, message);
        console.info(`${title}`.bgBlue, `${message}`.bgBlue);
        LocalLogs.info(title, message);
    },
    success(title: string, message: any) {
        // console.log(title, message)
        console.log(`${title}`.bgGreen, `${message}`.bgGreen)
        LocalLogs.info(title, message);
    }

}

export default Logs;
