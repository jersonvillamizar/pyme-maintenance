const bcrypt = require('bcryptjs')
const { Client } = require('pg')

async function main() {
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    database: 'pyme_maintenance',
    user: 'postgres',
    password: 'admin123'
  })

  try {
    await client.connect()

    // Eliminar usuario si existe
    await client.query("DELETE FROM users WHERE email = 'admin@mantenpro.com'")

    // Generar hash
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Insertar usuario
    await client.query(
      "INSERT INTO users (id, email, password, nombre, role, activo) VALUES ($1, $2, $3, $4, $5, $6)",
      ['admin001', 'admin@mantenpro.com', hashedPassword, 'Administrador', 'ADMIN', true]
    )

    console.log('✅ Usuario admin creado exitosamente!')
    console.log('Email: admin@mantenpro.com')
    console.log('Password: admin123')
  } catch (e) {
    console.error('❌ Error:', e.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
