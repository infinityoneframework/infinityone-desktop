const mac = process.platform === 'darwin'
const cmdKey = mac ? '⌘' : 'Ctrl'
export default {
  defaultServerURL: 'https://meet.jit.si',
  defaultServerTimeout: 30,
  appName: 'InfinityOne',
  toolTipColor: '#222',
  cmdKey,
  serverRetryTime1: 15000,
  serverRetryTime2: 30000,
  serverRetryTime3: 60000,
  serverRetryTime4: 300000,
  serverRetryThreshould1: 20,
  serverRetryThreshould2: 120,
  serverRetryThreshould3: 4 * 120
}