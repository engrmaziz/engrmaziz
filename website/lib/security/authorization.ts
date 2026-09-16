import { systemConfig } from '../system/config';
import { AuthenticatedUser, Permission, AuthorizationResult } from './types';
import { AuthenticationError, AuthorizationError, ForbiddenError } from './errors';
import { PERMISSIONS } from './policies';
import { isPlaceholderSecret, timingSafeEqualString } from './crypto';

export class AuthorizationService {
  /**
   * Authenticates a request by verifying the Authorization Bearer token matches
   * the configured ADMIN_API_TOKEN in systemConfig.
   */
  public authenticate(authHeader: string | null): AuthenticatedUser {
    if (!authHeader) {
      throw new AuthenticationError('Unauthorized');
    }

    const match = authHeader.match(/^Bearer\s+(.+)$/);
    if (!match?.[1]) {
      throw new AuthenticationError('Unauthorized');
    }

    const expected = systemConfig.ADMIN_API_TOKEN;
    if (isPlaceholderSecret(expected)) {
      throw new AuthenticationError('Unauthorized');
    }

    if (!timingSafeEqualString(match[1], expected || "")) {
      throw new AuthenticationError('Unauthorized');
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

  public authenticateRequest(req: Request): AuthenticatedUser {
    return this.authenticate(req.headers.get("Authorization"));
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
