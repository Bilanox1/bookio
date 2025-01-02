import { Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminUserGlobalSignOutCommand,
  GetUserCommand,
  MessageActionType,
  AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private cognitoClient = new CognitoIdentityProviderClient({
    region: 'eu-north-1', // تغيير المنطقة حسب الإعدادات
  });

  private readonly userPoolId = 'eu-north-1_bYMU7Olzt'; // UserPoolId الخاص بك
  private readonly clientId = '11vnhbsuemclb7cda6fmc3n50h'; // ClientId الخاص بك
  private readonly clientSecret =
    '17p7ta8frls8ppc5f57f2jpd3gg7oo1vh6tc4q3efssq5unnoku0'; // ClientSecret الخاص بك

  // دالة لتوليد SECRET_HASH
  private generateSecretHash(username: string): string {
    const hmac = crypto.createHmac('sha256', this.clientSecret);
    hmac.update(username + this.clientId);
    return hmac.digest('base64');
  }

  
  async register(createAuthDto: any) {
    const { username, email, password } = createAuthDto;

    try {
      const params = {
        UserPoolId: this.userPoolId,
        Username: email,
        TemporaryPassword: password,
        UserAttributes: [{ Name: 'email', Value: email }],
        MessageAction: MessageActionType.SUPPRESS,
      };

      const command = new AdminCreateUserCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // دالة لتسجيل الدخول
  async login(createAuthDto: any) {
    const { username, password } = createAuthDto;

    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    // توليد SECRET_HASH
    const secretHash = this.generateSecretHash(username);

    const params: AdminInitiateAuthCommandInput = {
      UserPoolId: this.userPoolId,
      ClientId: this.clientId,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      // إرسال الطلب إلى Cognito
      const command = new AdminInitiateAuthCommand(params);
      const response = await this.cognitoClient.send(command);

      // تحقق من النتيجة
      if (!response.AuthenticationResult) {
        throw new Error('Authentication failed: No tokens returned.');
      }

      return {
        message: 'Login successful',
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        expiresIn: response.AuthenticationResult.ExpiresIn,
        tokenType: response.AuthenticationResult.TokenType,
      };
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException') {
        throw new Error('Incorrect username or password.');
      } else if (error.name === 'UserNotFoundException') {
        throw new Error('User does not exist.');
      } else if (error.name === 'PasswordResetRequiredException') {
        throw new Error('User must reset their password before logging in.');
      } else {
        throw new Error(`Login failed: ${error.message}`);
      }
    }
  }

  async logout(accessToken: string) {
    try {
      const user = await this.getUser(accessToken); 
      const username = user.Username; 

      const params = {
        AccessToken: accessToken,
        UserPoolId: this.userPoolId, 
        Username: username,
      };

      const command = new AdminUserGlobalSignOutCommand(params);
      await this.cognitoClient.send(command);
      return { message: 'Logout successful' };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  async getUser(accessToken: string) {
    try {
      const params = {
        AccessToken: accessToken,
      };
      const command = new GetUserCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      throw new Error(`Get user failed: ${error.message}`);
    }
  }
}
