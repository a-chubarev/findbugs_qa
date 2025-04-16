require('dotenv').config();

export class MainPage{
    constructor(page){
        this.page = page;

        this.bugMessage = this.page.getByRole('heading', { name: 'You found a crash bug' })
    }

    async openPage(){
        await this.page.goto(process.env.BASE_URL);
    }

}
