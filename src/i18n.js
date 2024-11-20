// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "mainInfo": "Main Information",
        "organizer": "Organizer",
        "discipline": "Discipline",
        "location": "Location",
        "costs": "Costs",
        "assignments": "Assignments",
        "close": "Close",
        "edit": "Edit",
        "delete": "Delete"
      }
    },
    es: {
      translation: {
        "mainInfo": "Información Principal",
        "organizer": "Organizador",
        "discipline": "Disciplina",
        "location": "Lugar",
        "costs": "Costes",
        "assignments": "Asignaciones",
        "close": "Cerrar",
        "edit": "Editar",
        "delete": "Eliminar"
      }
    },
    gl: {
      translation: {
        "mainInfo": "Información Principal",
        "organizer": "Organizador",
        "discipline": "Disciplina",
        "location": "Lugar",
        "costs": "Custos",
        "assignments": "Asignacións",
        "close": "Pechar",
        "edit": "Editar",
        "delete": "Eliminar"
      }
    }
  },
  lng: "es", // Idioma por defecto
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});

export default i18n;