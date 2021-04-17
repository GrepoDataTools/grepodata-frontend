// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    // url: 'https://grepodata.com',
    url: 'localhost:4200',
    // apiUrl: 'https://api.grepodata.com',
    apiUrl: 'https://apitest.grepodata.com',
    // apiUrl: 'http://api-grepodata-com.local:8080',
    recaptcha: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    // discordLoginUrl: `https://discord.com/api/oauth2/authorize?client_id=735056972977537106
    // &redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Flogin&response_type=code&scope=identify%20email`,
    // discordClientId: '735056972977537106',
    // discordClientSecret: 'RGGYGml0X4mDwP92XZFU_0rHGXAGhItt',
    ROLE_READ: 'read',
    ROLE_WRITE: 'write',
    ROLE_ADMIN: 'admin',
    ROLE_OWNER: 'owner'
};
