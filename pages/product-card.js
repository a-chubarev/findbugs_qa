import {ProductReply} from "../helpers";
import {expect} from "@playwright/test";

/**
 * Карточка товара
 */
export class ProductCard {
    constructor(page) {
        this.page = page;

        // Локаторы для элементов карточки продукта
        this.productImage = page.locator('.product-card__image');
        this.productName = page.locator('.product-card__name');
        this.productPrice = page.locator('.product-card__price');
        this.addToCartButton = page.locator('.product-card__add-to-cart');
        this.favoriteButton = page.locator('.product-card__favorite');

        //Локатор для выбора цвета товара
        this.colorItem = (optionItemId) =>
            page.locator(`.ec_details_swatches.ec_details_html_swatches li.ec_details_swatch[data-optionitem-id="${optionItemId}"]`);

        // Локатор для выпадающего списка валют
        this.currencySelect = page.locator('#ec_currency_conversion');

        //Локаторы для публикации комментария
        this.commentTextarea = page.locator('#comment');
        this.authorInput = page.locator('#author');
        this.emailInput = page.locator('#email');
        this.websiteInput = page.locator('#url');
        this.submitButton = page.locator('#submit');

        //Локаторы для авторизации под карточкой товара
        this.authEmailInput = page.locator('#ec_account_login_widget_email');
        this.authPasswordInput = page.locator('#ec_account_login_widget_password');
        this.signInButton = page.locator('.ec_login_widget_button.ec-widget-login');
        this.signUpLink = page.locator('a[href*="register"]');

        //Локаторы для выбора количества товара
        this.minusProductQuantityButton = page.locator('.ec_minus');
        this.plusProductQuantityButton = page.locator('.ec_plus');
        this.quantityInputField = page.locator('.product-card__quantity-input');

    }

    /**
     * Получить название продукта
     * @returns {Promise<string>}
     */
    async getProductName() {
        return await this.productName.textContent();
    }

    /**
     * Получить цену продукта
     * @returns {Promise<string>}
     */
    async getProductPrice() {
        return await this.productPrice.textContent();
    }

    /**
     * Добавить продукт в корзину
     */
    async addToCart() {
        await this.addToCartButton.click();
    }

    /**
     * Установить количество товара
     * @param {number} quantity - Количество товара
     */
    async setQuantity(quantity) {
        await this.quantityInputField.fill(quantity.toString());
    }

    /**
     * Нажать на кнопку "Добавить в избранное"
     */
    async clickFavoriteButton() {
        await this.favoriteButton.click();
    }

    /**
     * Выбор валюты для оплаты из списка.
     * На вход принимает 4 валюты: USD, EUR, GBP, JPY, на остальных падает ошибка
     * @param currency
     * @returns {Promise<void>}
     */
    async selectCurrency(currency) {
        let validCurrency;

        switch (currency.toUpperCase()) {
            case 'USD':
            case 'EUR':
            case 'GBP':
            case 'JPY':
                validCurrency = currency.toUpperCase();
                break;
            default:
                throw new Error(`Недопустимая валюта: ${currency}. Допустимые значения: USD, EUR, GBP, JPY`);
        }
        await this.currencySelect.click();
        await this.page.waitForLoadState();
        await this.currencySelect.selectOption(validCurrency);
        await this.currencySelect.dispatchEvent('change');
        //Вариант ниже сработал только с явно заданным таймаутом
        //await this.currencySelect.selectOption({ value: validCurrency });
    }

    /**
     * Оставить комментарий под товаром
     * @returns {Promise<void>}
     */
    async fillProductReply(){
        let productReply = new ProductReply()
        await this.authorInput.fill(productReply.name)
        await this.emailInput.fill(productReply.email)
        await this.websiteInput.fill(productReply.website)
        await this.submitButton.click()

    }

    /**
     *Нажать на кнопку Sign In (Авторизация)
     */
    async clickSignInButton() {
        await this.signInButton.click();
    }

    /**
     *Нажать на ссылку Sign Up (Регистрация)
     */
    async clickSignUpLink() {
        await this.signUpLink.click();
    }

    /**
     * Выбор цвета товара по его ID
     * @param colorId
     * @returns {Promise<void>}
     */
    async selectProductColor(colorId){
        const colorLocator = this.colorItem(colorId);
        //Я не знаю уже что сделать, чтобы убрать таймаут, потому что другие способы проверки у меня не сработали -
        // пробовал проверять по isVisible для элемента выбора цвет, для картинки,
        // ставить экспект на видимость - ничего из этого не сработало
        await this.page.waitForTimeout(6000)

        // Находим дочерний элемент <img> внутри <li>
        const imageLocator = colorLocator.locator('img');

        // Ждем, пока элемент станет видимым
        await colorLocator.waitFor({ state: 'visible', timeout: 5000 });

        // Кликаем по элементу
        await colorLocator.click();
    }

    /**
     * Увеличивает количество товара через кнопку "+"
     * @param times - количество нажатий на кнопку
     * @returns {Promise<void>}
     */
    async increaseProductQuantity(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.plusProductQuantityButton.click();
        }
    }

    /**
     * Уменьшает количество товара через кнопку "-"
     * @param times - количество нажатий на кнопку
     * @returns {Promise<void>}
     */
    async decreaseProductQuantity(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.minusProductQuantityButton.click();
        }
    }
}