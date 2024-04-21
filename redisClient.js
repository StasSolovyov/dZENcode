const Redis = require('ioredis');

const client = new Redis({
    password: 'bBMXXvOUFsTJu46ZaADt0TbwDbDvqGlu',
    host: 'redis-13556.c135.eu-central-1-1.ec2.redns.redis-cloud.com',
    port: 13556,
});

client.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

client.on('connect', () => {
    console.log('Redis client connected');
    client.set('testKey', 'Hello, Redis!', (err, reply) => {
        if (err) {
            console.error('Error setting key:', err);
        } else {
            console.log('Key set successfully:', reply);
            client.get('testKey', (err, value) => {
                if (err) {
                    console.error('Error getting key:', err);
                } else {
                    console.log('Value of testKey:', value);
                    // Здесь нет вызова client.quit(), соединение не закрывается
                    console.log('All operations completed successfully');
                }
            });
        }
    });
});

// Экспорт клиента Redis для использования в других частях приложения
module.exports = client;
