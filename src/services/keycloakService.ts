import axios from 'axios';
import { createQRCodeForUser } from './qrCodeService';
import { createUserInZammadService, findUserByEmailFromZammad } from './zammadService';

const baseUrl = process.env.KEYCLOAK_BASE_URL;
const realm = process.env.KEYCLOAK_REALM;
const clientId = process.env.KEYCLOAK_CLIENT_ID;
const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

/**
 * Helper function to obtain an admin access token from Keycloak.
 */
async function getAdminAccessToken(): Promise<string> {
  console.log('[getAdminAccessToken] Starting to fetch admin access token');
  console.log('[getAdminAccessToken] KEYCLOAK_BASE_URL:', process.env.KEYCLOAK_BASE_URL);
  const tokenUrl = `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;

  // Create URLSearchParams instance with required fields
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('username', process.env.KEYCLOAK_ADMIN_USERNAME!);
  params.append('password', process.env.KEYCLOAK_ADMIN_PASSWORD!);
  params.append('grant_type', 'password');

  try {
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    console.log('[getAdminAccessToken] Admin access token retrieved successfully');
    return response.data.access_token;
  } catch (error: any) {
    console.error(
      '[getAdminAccessToken] Error fetching admin access token:',
      error.response?.status,
      error.response?.data
    );
    throw new Error(
      `Failed to fetch admin access token: ${error.response?.status} ${error.response?.data}`
    );
  }
}

export const validateToken = async (token: string): Promise<{ sub: string; email: string }> => {
  try {
    console.log("token: ", token)
    // Call the introspection endpoint
    const response = await axios.post(
      `${baseUrl}/realms/${realm}/protocol/openid-connect/token/introspect`,
      new URLSearchParams({
        token,
        client_id: clientId as string,
        client_secret: clientSecret as string,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = response.data;

    // Check if the token is active
    if (!data.active) {
      throw new Error('Unauthorized: Token is inactive or invalid');
    }

    // Extract the required claims
    const { sub, email } = data;

    if (!sub || !email) {
      throw new Error('Unauthorized: Token is missing required claims');
    }

    return {
      sub,
      email,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error('Token introspection error:', error.message);
    } else {
      console.error('Token introspection error:', error);
    }
    throw new Error('Unauthorized: Invalid token');
  }
};

/**
 * Helper function to check if a user already exists in Keycloak by email.
 */
async function getUserFromKeycloak(email: string, token: string): Promise<{ id: string; email: string } | null> {
  const baseUrl = process.env.KEYCLOAK_BASE_URL;
  const realm = process.env.KEYCLOAK_REALM;
  const searchUrl = `${baseUrl}/admin/realms/${realm}/users?email=${encodeURIComponent(email)}`;

  try {
    const response = await axios.get(searchUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data && response.data.length > 0) {
      const foundUser = response.data[0];
      console.log('[getUserFromKeycloak] Found user with id:', foundUser.id);
      return { id: foundUser.id, email: foundUser.email };
    } else {
      return null;
    }
  } catch (error: any) {
    console.error(
      '[getUserFromKeycloak] Error fetching user:',
      error.response?.status,
      error.response?.data
    );
    throw new Error(`Failed to fetch user: ${error.response?.status} ${error.response?.data}`);
  }
}

/**
 * Creates a new user in Keycloak using the admin access token.
 * If the user already exists, it skips creation.
 */
export const createUserInKeycloakAndZammadWithQRCode = async (
  email: string,
  password: string,
  qrCode: string,
  firstName: string,
  lastName: string
) => {
  console.log('[createUserInKeycloakWithQRCode] Starting process for email:', email);
  const baseUrl = process.env.KEYCLOAK_BASE_URL;
  const realm = process.env.KEYCLOAK_REALM;
  const token = await getAdminAccessToken();

  const createUserUrl = `${baseUrl}/admin/realms/${realm}/users`;
  const payload = {
    email,
    firstName,
    lastName,
    username: email,
    enabled: true,
    credentials: [
      {
        type: 'password',
        value: password,
        temporary: false,
      },
    ],
  };

  let user: { id: string | null; email: string } = { id: null, email };

  // Check if user already exists in Keycloak.
  const existingUser = await getUserFromKeycloak(email, token);
  if (existingUser) {
    user = existingUser;
    console.log('[createUserInKeycloakWithQRCode] User already exists in Keycloak with id:', user.id);
  } else {
    try {
      console.log('[createUserInKeycloakWithQRCode] Creating user in Keycloak for email:', email);
      const response = await axios.post(createUserUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      // Keycloak returns a 201 Created with a Location header containing the new user URL.
      const location = response.headers.location;
      if (location) {
        const parts = location.split('/');
        user.id = parts[parts.length - 1];
        console.log('[createUserInKeycloakWithQRCode] User created with id:', user.id);
      } else {
        console.warn('[createUserInKeycloakWithQRCode] No location header found in response');
      }
    } catch (error: any) {
      console.error(
        '[createUserInKeycloakWithQRCode] Error creating user in Keycloak for email:',
        email,
        error.response?.status,
        error.response?.data
      );
      throw new Error(
        `Failed to create user: ${error.response?.status} ${error.response?.data}`
      );
    }
  }

  // Create the QR Code for the user.
  try {
    console.log('[createUserInKeycloakWithQRCode] Creating QR code for user:', email);
    await createQRCodeForUser(email, qrCode, password);
    console.log('[createUserInKeycloakWithQRCode] QR code created successfully for user:', email);
  } catch (error: any) {
    console.error(
      '[createUserInKeycloakWithQRCode] Error creating QR code for email:',
      email,
      error.response?.status,
      error.response?.data
    );
    // If the QR Code creation fails and the user was newly created, delete the user from Keycloak.
    if (!existingUser && user.id) {
      const deleteUserUrl = `${baseUrl}/admin/realms/${realm}/users/${user.id}`;
      console.log('[createUserInKeycloakWithQRCode] Deleting newly created user from Keycloak due to QR code failure, user id:', user.id);
      await axios.delete(deleteUserUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[createUserInKeycloakWithQRCode] User deleted from Keycloak successfully');
    }
    throw new Error(
      `Failed to create user with QR code: ${error.response?.status} ${error.response?.data}`
    );
  }

  //check and create user in zammad
  try {

    const isUser = await findUserByEmailFromZammad(email);
    if (isUser) {
      console.log('[createUserInKeycloakWithQRCode] User already exists in Zammad:', email);
      return isUser;
    }

    const user = await createUserInZammadService(email, password, firstName, lastName);
    console.log('[createUserInKeycloakWithQRCode] User created in Zammad:', user);
  } catch (error: any) {
    console.error(
      '[createUserInKeycloakWithQRCode] Error creating user in Zammad for email:',
      email,
      error.response?.status,
      error.response?.data
    );
    throw new Error(
      `Failed to create user in Zammad: ${error.response?.status} ${error.response?.data}`
    );
  }

  return user;
};
