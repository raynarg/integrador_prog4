import { body, param } from 'express-validator';

export const validarId = [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
];

export const validarCurso = [
    body('nombre').trim().notEmpty().isLength({ max: 200 }),
    body('descripcion').trim().notEmpty(),
    body('fecha_inicio').isDate(),
    body('cantidad_horas').isInt({ min: 1, max: 500 }),
    body('inscriptos_max').isInt({ min: 1 }),
    body('id_curso_estado').isInt({ min: 1, max: 3 }),
];

export const validarEstudiante = [
    body('documento').trim().notEmpty().isLength({ min: 7, max: 20 }),
    body('nombres').trim().notEmpty().isLength({ max: 100 }),
    body('apellido').trim().notEmpty().isLength({ max: 100 }),
    body('email').trim().isEmail().isLength({ max: 150 }),
    body('fecha_nacimiento').isDate(),
];

export const validarInscripcion = [
    body('id_estudiante').isInt({ min: 1 }).withMessage('El ID del estudiante es requerido y debe ser entero'),
    body('id_curso').isInt({ min: 1 }).withMessage('El ID del curso es requerido y debe ser entero'),
    body('fecha_inscripcion').optional().isISO8601().withMessage('La fecha debe tener formato ISO8601'),
];

export const validarLogin = [
    body('nombre_usuario').trim().notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
];

export const validarCambioContrasenia = [
    body('contrasenia_actual').notEmpty().withMessage('La contraseña actual es requerida'),
    body('contrasenia_nueva').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres'),
];
