import api from '../services/api'; // Usa tu instancia de axios configurada

const logService = {
  /**
   * Envía un log al backend.
   * @param {string} level - Nivel de log (info, warning, error, etc.)
   * @param {string} message - Mensaje de log
   * @param {object} meta - Metadatos opcionales (usuario, transacción, etc.)
   */
  log: async (level, message, meta = {}) => {
    const logEntry = {
      level,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };

    try {
      // Envía el log al backend
      await api.post('/logs', logEntry);
    } catch (error) {
      console.error("Error al enviar el log al backend:", error);
      // Aquí podrías almacenar el log en el almacenamiento local o realizar una acción de recuperación
    }
  },
};

export default logService;