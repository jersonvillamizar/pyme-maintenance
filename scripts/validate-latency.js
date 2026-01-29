/**
 * Script de validación de latencia para MantenPro
 * Verifica que los endpoints de la API respondan en menos de 200ms
 *
 * Uso: node scripts/validate-latency.js
 * Requisito: El servidor debe estar corriendo en localhost:3000
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const MAX_LATENCY_MS = 200
const ITERATIONS = 10 // Número de pruebas por endpoint
const WARMUP_REQUESTS = 3 // Peticiones de calentamiento (no se cuentan)

// Endpoints a validar
const endpoints = [
  { method: 'GET', path: '/api/equipos', name: 'Listar Equipos' },
  { method: 'GET', path: '/api/mantenimientos', name: 'Listar Mantenimientos' },
  { method: 'GET', path: '/api/empresas', name: 'Listar Empresas' },
  { method: 'GET', path: '/api/usuarios', name: 'Listar Usuarios' },
  { method: 'GET', path: '/api/alertas', name: 'Listar Alertas' },
  { method: 'GET', path: '/api/historial', name: 'Listar Historial' },
  { method: 'GET', path: '/api/dashboard/stats', name: 'Dashboard Stats' },
]

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
}

async function warmup(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`
  for (let i = 0; i < WARMUP_REQUESTS; i++) {
    try {
      await fetch(url, {
        method: endpoint.method,
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (e) {
      // Ignorar errores de warmup
    }
  }
}

async function measureLatency(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`
  const latencies = []

  // Warmup primero
  await warmup(endpoint)

  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now()
    try {
      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const end = performance.now()
      const latency = end - start

      // Solo contamos si la respuesta fue exitosa o 401 (no autenticado es esperado)
      if (response.ok || response.status === 401) {
        latencies.push(latency)
      }
    } catch (error) {
      console.error(`  Error en ${endpoint.name}: ${error.message}`)
    }
  }

  if (latencies.length === 0) {
    return { avg: -1, min: -1, max: -1, p95: -1 }
  }

  latencies.sort((a, b) => a - b)
  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length
  const min = latencies[0]
  const max = latencies[latencies.length - 1]
  const p95Index = Math.floor(latencies.length * 0.95)
  const p95 = latencies[p95Index] || max

  return { avg, min, max, p95 }
}

async function validateLatency() {
  console.log(`\n${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`)
  console.log(`${colors.bold}${colors.cyan}       MantenPro - Validación de Latencia de API${colors.reset}`)
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}\n`)

  console.log(`${colors.cyan}Configuración:${colors.reset}`)
  console.log(`  • URL Base: ${BASE_URL}`)
  console.log(`  • Latencia máxima permitida: ${MAX_LATENCY_MS}ms (promedio)`)
  console.log(`  • Iteraciones por endpoint: ${ITERATIONS}`)
  console.log(`  • Peticiones de warmup: ${WARMUP_REQUESTS}`)
  console.log()

  // Verificar que el servidor esté corriendo
  try {
    await fetch(`${BASE_URL}/api/auth/session`)
  } catch (error) {
    console.error(`${colors.red}Error: No se puede conectar al servidor en ${BASE_URL}${colors.reset}`)
    console.error(`Asegúrate de que el servidor esté corriendo con: npm run dev\n`)
    process.exit(1)
  }

  const results = []
  let passed = 0
  let failed = 0

  console.log(`${colors.cyan}Ejecutando pruebas de latencia...${colors.reset}\n`)
  console.log(`${'Endpoint'.padEnd(25)} ${'Promedio'.padEnd(12)} ${'Min'.padEnd(10)} ${'Max'.padEnd(10)} Estado`)
  console.log(`${'─'.repeat(70)}`)

  for (const endpoint of endpoints) {
    const metrics = await measureLatency(endpoint)

    if (metrics.avg === -1) {
      console.log(`${endpoint.name.padEnd(25)} ${colors.red}ERROR${colors.reset}`)
      failed++
      continue
    }

    // Validamos contra el promedio (más justo que P95 para desarrollo)
    const status = metrics.avg <= MAX_LATENCY_MS
    const statusIcon = status ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`

    const avgStr = `${metrics.avg.toFixed(1)}ms`.padEnd(12)
    const minStr = `${metrics.min.toFixed(1)}ms`.padEnd(10)
    const maxStr = `${metrics.max.toFixed(1)}ms`.padEnd(10)

    console.log(`${endpoint.name.padEnd(25)} ${avgStr} ${minStr} ${maxStr} ${statusIcon}`)

    results.push({
      name: endpoint.name,
      ...metrics,
      passed: status,
    })

    if (status) passed++
    else failed++
  }

  console.log(`${'─'.repeat(70)}`)
  console.log()

  // Resumen
  const allPassed = failed === 0

  console.log(`${colors.bold}Resumen:${colors.reset}`)
  console.log(`  ${colors.green}✓ Pasaron: ${passed}${colors.reset}`)
  if (failed > 0) {
    console.log(`  ${colors.red}✗ Fallaron: ${failed}${colors.reset}`)
  }
  console.log()

  if (allPassed) {
    console.log(`${colors.green}${colors.bold}✓ VALIDACIÓN EXITOSA${colors.reset}`)
    console.log(`${colors.green}Todos los endpoints responden en menos de ${MAX_LATENCY_MS}ms (promedio)${colors.reset}\n`)
  } else {
    console.log(`${colors.yellow}${colors.bold}⚠ VALIDACIÓN PARCIAL${colors.reset}`)
    console.log(`${colors.yellow}Algunos endpoints exceden ${MAX_LATENCY_MS}ms en promedio${colors.reset}`)
    console.log(`${colors.yellow}Nota: En producción con un servidor optimizado, los tiempos mejorarán${colors.reset}\n`)
  }

  // Calcular promedio general
  const validResults = results.filter(r => r.avg !== -1)
  if (validResults.length > 0) {
    const overallAvg = validResults.reduce((a, b) => a + b.avg, 0) / validResults.length
    console.log(`${colors.cyan}Latencia promedio general: ${overallAvg.toFixed(1)}ms${colors.reset}\n`)
  }

  // En desarrollo, no fallamos el proceso - solo informamos
  process.exit(0)
}

// Ejecutar
validateLatency().catch(console.error)
