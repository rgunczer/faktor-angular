import { HttpUrlEncodingCodec } from '@angular/common/http';

export class CustomHttpUrlEncodingCodec extends HttpUrlEncodingCodec {

    // encodeKey(k: string): string {
    //     const v = encodeURIComponent(k);
    //     return v;
    // }

    encodeValue(k: string): string {
        const v = encodeURIComponent(k);
        return v;
    }

}
