// ============================================================
//  src/repositories/usuariosRepository.js
//  Capa de Repositorio — Acceso a datos de la tabla usuarios
//
//  Responsabilidad única: ejecutar queries SQL sobre usuarios.
//  No aplica lógica de negocio (eso es trabajo del servicio).
// ============================================================

import { pool } from '../config/db.js'; // pool de conexiones a PostgreSQL

// ─────────────────────────────────────────────────────────────
//  Buscar usuario por nombre de usuario (para el proceso de login)
// ─────────────────────────────────────────────────────────────
/**
 * Retorna el registro completo del usuario (incluye la contraseña hasheada)
 * o `undefined` si no existe o está inactivo.
 *
 * @param {string} nombre_usuario - Nombre de usuario a buscar
 * @returns {Promise<object|undefined>}
 */
export async function findById(id) {
    const resultado = await pool.query(
        `SELECT id_usuario, apellido, nombre, nombre_usuario, contrasenia
         FROM usuarios
         WHERE id_usuario = $1
           AND activo = 1`,
        [id]
    );
    return resultado.rows[0];
}

export async function findByUsername(nombre_usuario) {
    const resultado = await pool.query(
        `SELECT id_usuario, apellido, nombre, nombre_usuario, contrasenia
         FROM usuarios
         WHERE nombre_usuario = $1
           AND activo = 1`,
        [nombre_usuario]
    );
    return resultado.rows[0];
}

export async function updatePassword(id, hashedPassword) {
    await pool.query(
        `UPDATE usuarios
         SET contrasenia = $1
         WHERE id_usuario = $2
           AND activo = 1`,
        [hashedPassword, id]
    );
}

export async function findAll() {
    const resultado = await pool.query(
        `SELECT id_usuario, apellido, nombre, nombre_usuario
         FROM usuarios
         WHERE activo = 1
         ORDER BY apellido ASC, nombre ASC`
    );
    return resultado.rows;
}

export async function create({ nombre, apellido, nombre_usuario, contrasenia }) {
    const resultado = await pool.query(
        `INSERT INTO usuarios (nombre, apellido, nombre_usuario, contrasenia, activo)
         VALUES ($1, $2, $3, $4, 1)
         RETURNING id_usuario, nombre, apellido, nombre_usuario`,
        [nombre, apellido, nombre_usuario, contrasenia]
    );
    return resultado.rows[0];
}

export async function update(id, { nombre, apellido, nombre_usuario }) {
    const resultado = await pool.query(
        `UPDATE usuarios
         SET nombre = $1, apellido = $2, nombre_usuario = $3
         WHERE id_usuario = $4
           AND activo = 1
         RETURNING id_usuario, nombre, apellido, nombre_usuario`,
        [nombre, apellido, nombre_usuario, id]
    );
    return resultado.rows[0];
}

export async function deactivate(id) {
    const resultado = await pool.query(
        `UPDATE usuarios
         SET activo = 0
         WHERE id_usuario = $1
         RETURNING id_usuario`,
        [id]
    );
    return resultado.rows[0];
}
