export type Permission = string;

export interface AuthenticatedUser {
  id: string;
  permissions: Permission[];
}

export interface AuthorizationContext {
  user: AuthenticatedUser;
  requiredPermissions: Permission[];
}

export interface AuthorizationResult {
  granted: boolean;
  reason?: string;
}

export interface SecurityPolicy {
  name: string;
  description: string;
}
