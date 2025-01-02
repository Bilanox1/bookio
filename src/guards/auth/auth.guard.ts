import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  private JWKS_URL =
    'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_JSoFyWFzJ/.well-known/jwks.json';

  private jwks = jwksClient({
    jwksUri: this.JWKS_URL,
  });

  private async getSigningKey(kid: string): Promise<string> {
    const keys = await this.jwks.getSigningKeys();
    const key: any = keys.find((key) => key.kid === kid);

    if (!key) {
      throw new UnauthorizedException('No matching key found');
    }

    return key.publicKey || key.rsaPublicKey;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decodedHeader: any = jwt.decode(token, { complete: true });
      if (!decodedHeader || !decodedHeader.header.kid) {
        throw new UnauthorizedException('Invalid token header');
      }

      const publicKey = await this.getSigningKey(decodedHeader.header.kid);

      const verifiedToken = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });

      request.user = verifiedToken;

      return true;
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
