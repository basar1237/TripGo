// Basit log sistemi - gerçek kullanıcıları takip etmek için
interface LogEntry {
  id: string;
  timestamp: Date;
  userAgent: string;
  ip?: string;
  action: string;
  details: string;
}

class Logger {
  private logs: LogEntry[] = [];

  log(action: string, details: string) {
    const logEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      action,
      details
    };
    
    this.logs.push(logEntry);
    
    // Console'a yazdır (geliştirme için)
    console.log('🔍 User Activity:', logEntry);
    
    // LocalStorage'a kaydet
    localStorage.setItem('userLogs', JSON.stringify(this.logs));
  }

  getLogs(): LogEntry[] {
    const saved = localStorage.getItem('userLogs');
    if (saved) {
      this.logs = JSON.parse(saved);
    }
    return this.logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('userLogs');
  }
}

export const logger = new Logger();
