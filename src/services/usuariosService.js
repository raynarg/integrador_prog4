// ============================================================
//  src/services/usuariosService.js
//  Lógica de negocio para la gestión de usuarios administrativos.
// ============================================================

import crypto from 'crypto';
import * as repo from '../repositories/usuariosRepository.js';

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

export async function listarUsuarios() {
    return await repo.findAll();
}

export async function registrarUsuario({ nombre, apellido, nombre_usuario, contrasenia }) {
    const existente = await repo.findByUsername(nombre_usuario);
    if (existente) {
        const error = new Error('El nombre de usuario ya está en uso');
        error.statusCode = 400;
        throw error;
    }

    return await repo.create({
        nombre,
        apellido,
        nombre_usuario,
        contrasenia: sha256(contrasenia)
    });
}

export async function editarUsuario(id, datos) {
    if (datos.nombre_usuario) {
        const existente = await repo.findByUsername(datos.nombre_usuario);
        if (existente && existente.id_usuario !== parseInt(id)) {
            const error = new Error('El nombre de usuario ya está en uso');
            error.statusCode = 400;
            throw error;
        }
    }

    const actualizado = await repo.update(id, datos);
    if (!actualizado) {
        const error = new Error('Usuario no encontrado o inactivo');
        error.statusCode = 404;
        throw error;
    }
    return actualizado;
}

export async function cambiarPasswordUsuario(id, contraseniaNueva) {
    await repo.updatePassword(id, sha256(contraseniaNueva));
}

export async function darDeBajaUsuario(id) {
    const desactivado = await repo.deactivate(id);
    if (!desactivado) {
        const error = new Error('Usuario no encontrado o ya desactivado');
        error.statusCode = 404;
        throw error;
    }
    return desactivado;
}
