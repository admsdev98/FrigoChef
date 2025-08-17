// responseMessages.js
// Utilidad para adaptar mensajes técnicos a mensajes amigables para el usuario final

export function getUserFriendlyMessage(error, context = '') {
  if (!error) return '';

  // Si el error es por campos vacíos o validación
  if (error.message && /required|empty|missing|obligatorio|rellenar/i.test(error.message)) {
    return 'Por favor, rellena los campos necesarios antes de guardar.';
  }

  // Si el error es por autenticación
  if (error.message && /unauthorized|token|autenticación|401/i.test(error.message)) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
  }

  // Si el error es por conexión o backend
  if (error.message && /network|fetch|timeout|server|backend|502|503|504/i.test(error.message)) {
    return 'No se ha podido conectar con el servidor. Inténtalo de nuevo más tarde.';
  }

  // Si el error es por duplicados
  if (error.message && /duplicate|exists|único|duplicado/i.test(error.message)) {
    return 'Ya existe un elemento igual. Revisa los datos introducidos.';
  }

  // Mensaje genérico para cualquier otro error
  return 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.';
}
