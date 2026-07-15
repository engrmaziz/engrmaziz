import { systemConfig } from '../system';
import { AuthenticatedUser, Permission, AuthorizationResult } from './types';
import { AuthenticationError, AuthorizationError, ForbiddenError } from './errors';
import { PERMISSIONS } from './policies';

export class AuthorizationService {
  /**
   * Authenticates a request by verifying the Authorization Bearer token matches
   * the configured ADMIN_API_TOKEN in systemConfig.
   */
  public authenticate(authHeader: string | null): AuthenticatedUser {
    if (!authHeader) {
      throw new AuthenticationError('Missing Authorization header');
    }

    const match = authHeader.match(/^Bearer\s+(.*)$/);
    if (!match) {
      throw new AuthenticationError('Invalid Authorization header format. Expected "Bearer <token>"');
    }

    const token = match[1];

    if (!systemConfig.ADMIN_API_TOKEN) {
      throw new AuthenticationError('System configuration is missing ADMIN_API_TOKEN. Administration is locked.');
    }

    if (token !== systemConfig.ADMIN_API_TOKEN) {
      throw new AuthenticationError('Invalid authentication token');
    }

    return {
      id: 'admin',
      permissions: [
        PERMISSIONS.KNOWLEDGE_READ,
        PERMISSIONS.KNOWLEDGE_WRITE,
        PERMISSIONS.KNOWLEDGE_DELETE,
        PERMISSIONS.SYSTEM_READ
      ]
    };
  }

  /**
   * Authorizes an authenticated user against a set of required permissions.
   * Fails fast if any permission is missing.
   */
  public authorize(user: AuthenticatedUser, requiredPermissions: Permission[]): AuthorizationResult {
    if (!user) {
      throw new ForbiddenError('No authenticated user context provided for authorization');
    }

    for (const permission of requiredPermissions) {
      if (!user.permissions.includes(permission)) {
        throw new AuthorizationError(`Missing required permission: ${permission}`);
      }
    }

    return { granted: true };
  }
}

export const authorizationService = new AuthorizationService();
