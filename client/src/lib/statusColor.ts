/**
 * @description Restituisce il colore da imporre dietro al Badge per lo statusCode del server
 */
export const getStatusBadge = (statusString: string | undefined): string => {
  if (!statusString) return 'bg-gray-500 hover:bg-gray-600'; // Default grigio

  // parseInt parsa "200 OK" e si ferma al numero 200, ignorando "OK"
  const code = parseInt(statusString);

  if (code >= 200 && code < 300)
    return 'bg-green-500 hover:bg-green-600 text-white border-transparent'; // Successo
  if (code >= 300 && code < 400)
    return 'bg-blue-500 hover:bg-blue-600 text-white border-transparent'; // Redirect
  if (code >= 400 && code < 500)
    return 'bg-orange-500 hover:bg-orange-600 text-white border-transparent'; // Client Error
  if (code >= 500) return 'bg-red-500 hover:bg-red-600 text-white border-transparent'; // Server Error

  return 'bg-gray-500 text-white'; // Fallback
};
