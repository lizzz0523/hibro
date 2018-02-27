import { app, globalShortcut, BrowserWindow, BrowserView } from 'electron'
import * as path from 'path'
import * as url from 'url'

class WindowManager {
    private static windows: Set<BrowserWindow> = new Set()

    static isEmpty(): boolean {
        return WindowManager.windows.size === 0
    }

    static create(): void {
        const window = new BrowserWindow({
            width: 800,
            height: 600,
            show: false
        })
    
        window.loadURL(url.format({
            pathname: path.resolve(__dirname, '../../view/index.html'),
            protocol: 'file:',
            slashes: true
        }))

        window.once('ready-to-show', () => {
            window.maximize()
            window.show()
        })
    
        window.once('closed', () => {
            WindowManager.windows.delete(window)
        })

        WindowManager.windows.add(window)
    }

    static send(channel: string) {
        WindowManager.windows.forEach((window) => {
            window.webContents.send(channel)
        })
    }
}

app.on('ready', () => {
    WindowManager.create()

    globalShortcut.register('Esc', () => {
        WindowManager.send('blur')
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (WindowManager.isEmpty()) {
        WindowManager.create()
    }
})