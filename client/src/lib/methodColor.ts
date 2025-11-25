/**
 * @description Crea una piccola grafica per mostrare tutti i metodi accettati dal server
 */
export const getMethodBadgeVariant = (method: string) => {
  const m = method.toUpperCase();

  switch (m) {
    case 'GET':
    case 'HEAD':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200'; // Read-only (sicuri)

    case 'POST':
    case 'PUT':
    case 'PATCH':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200'; // Scrittura

    case 'DELETE':
    case 'TRACE':
    case 'CONNECT':
      return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200'; // Pericolosi

    default:
      return 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'; // Neutri (OPTIONS, ecc)
  }
};
