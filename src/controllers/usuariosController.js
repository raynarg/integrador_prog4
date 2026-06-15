// ============================================================
//  src/controllers/usuariosController.js
//  Controlador HTTP para la gestión de usuarios administrativos.
// ============================================================

import * as service from '../services/usuariosService.js';

export async function listar(req, res, next) {
    try {
        const lista = await service.listarUsuarios();
        res.json({ success: true, data: lista });
    } catch (error) {
        next(error);
    }
}

export async function crear(req, res, next) {
    try {
        const { nombre, apellido, nombre_usuario, contrasenia } = req.body;
        if (!nombre || !apellido || !nombre_usuario || !contrasenia) {
            return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
        }

        const nuevo = await service.registrarUsuario({ nombre, apellido, nombre_usuario, contrasenia });
        res.status(201).json({ success: true, data: nuevo });
    } catch (error) {
        next(error);
    }
}

export async function actualizar(req, res, next) {
    try {
        const { id } = req.params;
        const { nombre, apellido, nombre_usuario } = req.body;
        if (!nombre || !apellido || !nombre_usuario) {
            return res.status(400).json({ success: false, error: 'Todos los campos son requeridos' });
        }

        const actualizado = await service.editarUsuario(id, { nombre, apellido, nombre_usuario });
        res.json({ success: true, data: actualizado });
    } catch (error) {
        next(error);
    }
}

export async function resetPassword(req, res, next) {
    try {
        const { id } = req.params;
        const { contrasenia_nueva } = req.body;
        if (!contrasenia_nueva || contrasenia_nueva.length < 4) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 4 caracteres' });
        }

        await service.cambiarPasswordUsuario(id, contrasenia_nueva);
        res.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        next(error);
    }
}

export async function desactivar(req, res, next) {
    try {
        const { id } = req.params;
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, error: 'No puedes desactivar tu propia cuenta de administrador' });
        }

        await service.darDeBajaUsuario(id);
        res.json({ success: true, message: 'Usuario dado de baja correctamente' });
    } catch (error) {
        next(error);
    }
}
