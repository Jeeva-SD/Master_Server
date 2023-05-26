import { Request } from 'express';
import { controller, POST } from '../utils';
import Fav from '../core/fav';

@controller('/fav')
class FavController {
    private fav: Fav;

    constructor() {
        this.fav = this.favInstance();
    }

    @POST('/contact')
    public contact(req: Request) {
        return this.fav.contact(req.body);
    }

    @POST('/subscribe')
    public subscribe(req: Request) {
        return this.fav.subscribe(req.body.email);
    }

    private favInstance(): Fav {
        if (!this.fav) this.fav = new Fav();
        return this.fav;
    }
}

export default FavController;