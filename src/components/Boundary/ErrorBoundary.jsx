import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que la próxima renderización muestre la interfaz de respaldo
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes usar este método para registrar errores en un servicio externo de seguimiento de errores
    console.error("Error capturado por el Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier interfaz de respaldo personalizada
      return <h1>Algo salió mal. Intenta recargar la página.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;