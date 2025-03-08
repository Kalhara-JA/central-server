import axios from 'axios';
import prisma from '../lib/prisma';

export const createQRCodeForUser = async (email: string, qrCode: string, password: string) => {
    console.log('[createQRCodeForUser] Creating QR code for user:', email, 'with code:', qrCode);
    const result = await prisma.qRCode.create({
        data: {
            code: qrCode,
            user: {
                connectOrCreate: {
                    where: { email },
                    create: {
                        email,
                        name: '',
                        password,
                        userApps: {
                            create: {
                                role: 'transitional-app-role',
                                app: {
                                    connect: { id: process.env.QR_CODE_APP_ID },
                                },
                            },
                        },
                    },
                },
            },
        },
        include: {
            user: true,
        },
    });
    console.log('[createQRCodeForUser] QR code record created in database for user:', email);

    // Invalidate QR code via external API.
    console.log('[createQRCodeForUser] Invalidating QR code via API call...');
    console.log('[createQRCodeForUser] Invalidate API URL:', `${process.env.QR_CODE_API_URL}/api/v1/qrcode-app/invalidate`);
    try {
        const res = await axios.post('http://116.203.82.82:8093/api/v1/qrcode-app/invalidate', {
            qrCode,
        })
        console.log('[createQRCodeForUser] Invalidate API response status:', res.status);
    }
    catch (error: any) {
        console.log(
            error
        )
        console.error(
            '[createUserInKeycloakWithQRCode] Error creating QR code for email:',
            email,
            error.response?.status,
            error.response?.data
        );
        throw new Error(
            `Failed to create user: ${error.response?.status} ${error.response?.data}`
        );
    }

    return result;
};

export const getQRCodesByEmail = async (email: string) => {
    console.log('[getQRCodesByEmail] Retrieving QR codes for user with email:', email);
    const codes = await prisma.qRCode.findMany({
        where: { user: { email } },
    });
    console.log(`[getQRCodesByEmail] Retrieved ${codes.length} QR codes for email:`, email);
    return codes;
};
