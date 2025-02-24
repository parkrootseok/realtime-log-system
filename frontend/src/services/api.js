import axios from 'axios'

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const logService = {
    getLogs: () => api.get('/logs'),
    getErrorLogs: () => api.get('/logs/errors'),
    uploadLogs: (file) => {
        const formData = new FormData()
        formData.append('logFile', file)
        return api.post('/logs/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
    analyzeLogs: () => api.get('/logs/analyze'),
    getLogStream: () => {
        const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8080'
        return new WebSocket(`${wsUrl}/logs/stream`)
    },
}

export default api
