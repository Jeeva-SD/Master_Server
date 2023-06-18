import { exception, dataList, take } from '../../utils';
import { contactParams } from './types';
import { hasString } from '../../helper/common';
import { DB } from '../../database';
import { addMessage, getSubscriberCount, subscribe } from '../../database/quries';

class Fav {
    private db;
    constructor() {
        this.db = new DB;
    }

    public async contact(params: contactParams) {
        try {
            const { name, email, message }: contactParams = params;
            if (!hasString(name) || !hasString(email) || !hasString(message)) return take(501);

            const result = await this.db.execute(addMessage, [name, email, message]);
            return result ? take(500) : take(501);
        } catch (error) {
            return exception(error);
        }
    }

    public async subscribe(email: string) {
        try {
            if (!hasString(email)) return take(503);
            const data = await this.db.execute(getSubscriberCount, [email]);

            if (data[0].subscribers > 0) return take(504);

            const result = this.db.execute(subscribe, [email]);
            return result ? take(502) : take(503);
        } catch (error) {
            return exception(error);
        }
    }
}

export default Fav;