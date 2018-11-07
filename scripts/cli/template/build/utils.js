'use strict';
const net = require('net');

module.exports = {
    // 轮询检查端口
    intervalPort: (host, port) => {
        const defaultPort = port;

        // 连接检查端口是否被占用
        const connectPort = (host, port) => {
            return new Promise((resolve, reject) => {
                const testConnect = net.connect({ host: host, port: port }, function() {
                    this.destroy();
                    reject();
                });

                testConnect.on('error', function() {
                    this.destroy();
                    resolve();
                });
            });
        };

        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < 500; i++) {
                try {
                    await connectPort(host, port);

                    if (port === defaultPort) {
                        console.log(`======== The port [${ port }] is available ========`);
                    } else {
                        console.log(`======== The port has change to [${ port }] ========`);
                    }
                    return resolve({ host: host, port: port });
                } catch(err) {
                    console.log(`Wraning: The port [${ port ++ }] is occupied`);
                }
            }
        });
    }
}