import { Request } from 'express';
import * as crypto from 'crypto';

const VALID_ALGORITHMS = ['sha256', 'sha1'];

/**
 * Verifies the request by it's hub signature
 * @param req The request
 * @param secret The secret of the webhook
 * @returns undefined on success, error string on failure.
 */
export function verifyPayload(req: Request<{}, any, any, any, Record<string, any>>, secret: string) {
    let hubsig = req.header('x-hub-signature-256') ?? req.header('x-hub-signature');
    if (hubsig) {
        const algorithm = hubsig.split('=', 1)[0];
        if (!VALID_ALGORITHMS.includes(algorithm)) return 'UNKNOWN_ALGORITHM';
        hubsig = hubsig.substring(hubsig.indexOf('=') + 1, hubsig.length);
        const hash = crypto.createHmac(algorithm, secret).update(req.body).digest("hex");
        if (hubsig === hash) return undefined;
    }
    return "NO-SIGNATURE-HEADER";
}