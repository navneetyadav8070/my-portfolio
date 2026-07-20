const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

const styles = {
  info: 'color: #00ff88; font-weight: bold;',
  warn: 'color: #ffaa00; font-weight: bold;',
  error: 'color: #ff4444; font-weight: bold;',
  success: 'color: #00cc44; font-weight: bold;',
  auth: 'color: #8888ff; font-weight: bold;',
  route: 'color: #ff88ff; font-weight: bold;',
  firebase: 'color: #ffaa44; font-weight: bold;',
  payment: 'color: #44ddff; font-weight: bold;',
};

export const logger = {
  info: (tag, msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[${tag}]`, styles.info, msg, data || '');
  },
  
  warn: (tag, msg, data = null) => {
    if (!isDev) return;
    console.warn(`%c[${tag}]`, styles.warn, msg, data || '');
  },
  
  error: (tag, msg, data = null) => {
    console.error(`%c[${tag}]`, styles.error, msg, data || '');
  },
  
  success: (tag, msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[${tag}] ✅`, styles.success, msg, data || '');
  },
  
  auth: (msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[AUTH]`, styles.auth, msg, data || '');
  },
  
  route: (msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[ROUTE]`, styles.route, msg, data || '');
  },
  
  firebase: (msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[FIREBASE]`, styles.firebase, msg, data || '');
  },
  
  payment: (msg, data = null) => {
    if (!isDev) return;
    console.log(`%c[PAYMENT]`, styles.payment, msg, data || '');
  },
  
  section: (title) => {
    if (!isDev) return;
    console.log(`\n%c═══════════════════════════════════════`, 'color: #00ff88;');
    console.log(`%c  ${title}`, 'color: #00ff88; font-size: 16px; font-weight: bold;');
    console.log(`%c═══════════════════════════════════════`, 'color: #00ff88;');
  },
  
  pageLoad: () => {
    if (!isDev) return;
    const loadTime = performance.now();
    console.log(`%c[PERF] Page loaded in ${loadTime.toFixed(2)}ms`, 'color: #888;');
  },
  
  component: (name, props = {}) => {
    if (!isDev) return;
    console.log(`%c[COMPONENT] ${name} rendered`, 'color: #aaa;', props);
  },
};

export default logger;