export default function Page() {
    return (
        <pre>
            {JSON.stringify({
                DB_HOST_REMOTE: process.env.DB_HOST_REMOTE,
                DB_USER_REMOTE: process.env.DB_USER_REMOTE,
                DB_PASSWORD_REMOTE: process.env.DB_PASSWORD_REMOTE,
                DB_NAME_AUDITORIA: process.env.DB_NAME_AUDITORIA
            }, null, 2)}
        </pre>
    );
}
