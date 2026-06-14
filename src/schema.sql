-- Tabla de usuarios (para autenticación)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(255) NOT NULL,
  documento  VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pólizas
CREATE TABLE IF NOT EXISTS polizas (
  id              SERIAL PRIMARY KEY,
  numero_poliza   VARCHAR(100)   NOT NULL UNIQUE,
  cliente_id      INTEGER        NOT NULL,
  fecha_emision   DATE           NOT NULL,
  monto_asegurado NUMERIC(15, 2) NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_cliente
    FOREIGN KEY (cliente_id)
    REFERENCES clientes (id)
    ON DELETE RESTRICT,

  CONSTRAINT chk_monto_positivo
    CHECK (monto_asegurado > 0)
);

CREATE INDEX IF NOT EXISTS idx_polizas_cliente_id ON polizas (cliente_id);