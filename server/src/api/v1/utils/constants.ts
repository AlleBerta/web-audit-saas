export const constants = {
  OK: 200,
  RESOURCE_CREATED: 201,
  REDIRECT: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;

export type StatusCode = (typeof constants)[keyof typeof constants];
