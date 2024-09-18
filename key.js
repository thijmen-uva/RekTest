const frida = require('frida');
const readline = require('readline');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { dialog } = require('electron');
const { reverse } = require('dns');

const manual_rekordbox_executable_path = 'C:\\Program Files\\Pioneer\\rekordbox\\rekordbox.exe';

function getRekordboxInstallPath() {
    console.log('Searching for Rekordbox installation path...');
    const programFiles = os.arch() === 'x64' ? 'Program Files' : 'Program Files (x86)';
    const rekordboxPath = path.join(os.homedir().split(path.sep)[0], programFiles, 'rekordbox');
    const rekordboxPathV6 = path.join(os.homedir().split(path.sep)[0], programFiles, 'Pioneer');

    const directories = [
        ...fs.readdirSync(rekordboxPathV6, { withFileTypes: true }),
        ...fs.readdirSync(rekordboxPath, { withFileTypes: true })
    ].filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .reverse();

    console.log(directories);
    for (const dir of directories) {
        const files = fs.readdirSync(path.join(rekordboxPath, dir));
        if (files.some(file => file.endsWith('.exe'))) {
            return path.join(rekordboxPath, dir, 'rekordbox.exe');
        }
    }
    return null;
}

// JavaScript code that will be injected into the Rekordbox process
const SCRIPT = `
var sqlite3_key = Module.findExportByName(null, 'sqlite3_key');

Interceptor.attach(sqlite3_key, {
    onEnter: function(args) {
        var size = args[2].toInt32();
        var key = args[1].readUtf8String(size);
        send('sqlite3_key: ' + key);
    }
});
`;

async function extractKey(rekordboxPath) {
    let session, script;

    try {
        const pid = await frida.spawn(rekordboxPath);
        console.log(`Spawned Rekordbox process with PID: ${pid}`);

        session = await frida.attach(pid);
        console.log('Attached to Rekordbox process.');

        script = await session.createScript(SCRIPT);

        script.message.connect(message => {
            if (message.type === 'send' && message.payload.startsWith('sqlite3_key:')) {
                const key = message.payload.split(': ')[1];
                console.log(`Extracted SQLite key: ${key}`);
                try {
                    fs.writeFileSync('key.txt', key);
                    console.log('The key has been saved to key.txt!');
                } catch (err) {
                    console.error('Failed to write key to file', err);
                }
                session.detach();
                process.kill(pid, 'SIGKILL'); 
                process.exit(0);
            }
        });

        await script.load();
        console.log('Script loaded and waiting for key...');

        await frida.resume(pid);
        console.log('Resumed Rekordbox process.');

    } catch (err) {
        console.error(`Failed to extract key: ${err.message}`);
        if (session) {
            await session.detach();
        }
        if (script) {
            await script.unload();
        }
    }
}

rekordboxPath = getRekordboxInstallPath();
if (!rekordboxPath) {
            rekordboxPath = manual_rekordbox_executable_path;
};

module.exports = { extractKey, getRekordboxInstallPath };

