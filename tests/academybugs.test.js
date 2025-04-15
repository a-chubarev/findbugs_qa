import {expect, test} from "@playwright/test";
import {MainPage, ProductsPage, ProductCard, RegisterPage, ForgotPasswordPage, UserCartPage} from '../pages'
import {th} from "@faker-js/faker";

test.describe.serial('Academybugs Test', () => {
    let mainPage
    let productsPage
    let productCard
    let registerPage
    let forgotPasswordPage
    let userCartPage
    test.beforeEach(async ({page}) =>{
        mainPage = new MainPage(page);
        productsPage = new ProductsPage(page);
        productCard = new ProductCard(page);
        registerPage = new RegisterPage(page);
        forgotPasswordPage = new ForgotPasswordPage(page);
        userCartPage = new UserCartPage(page);
        await mainPage.openPage()
    })

    test('The page freezes when clicking on the numbers of results', async ({page}) => {
        //Выбираем количество товаров на странице
        await productsPage.selectPerPage(50)
        await expect(page.getByRole('heading', { name: 'You found a crash bug' })).toBeVisible();
    })

    test('The page freezes when changing the currency', async ({page}) => {
        //Кликаем на товар
        await productsPage.productItem('4481370').click()
        //Добавил в тест, а не в метод selectCurrency - в нем ожидание не срабатывает
        //TODO: убрать таймаут
        //await page.waitForTimeout(6000)
        //await productCard.currencySelect.waitFor({ state: 'visible' })
        await productCard.selectCurrency('eur')
        await expect(page.getByRole('heading', { name: 'You found a crash bug, examine the page for 5 seconds' }).first()).toBeVisible({timeout: 40000});
    })

    test('The page becomes unresponsive when clicking on "Retrieve Password" and no email is sent', async ({page}) => {
        await productsPage.productItem('4481370').click()
        await productCard.clickSignUpLink()
        await registerPage.clickForgotPasswordLink()
        await forgotPasswordPage.fillRetrieveEmailField()
        await forgotPasswordPage.clickRetrievePasswordButton()
        await expect(page.getByRole('heading', { name: 'You found a crash bug' })).toBeVisible();
    })

    test('The page becomes unresponsive when clicking on "Post Comment"', async ({page}) => {
        await productsPage.productItem('4481370').click()
        await productCard.fillProductReply()
        await expect(page.getByRole('heading', { name: 'You found a crash bug' })).toBeVisible({timeout:25000});
    })

    test(' The page becomes unresponsive when increasing the quantity with the pink or green colors chosen', async ({page}) => {
        await productsPage.productItem('4381370').click()
        await productCard.selectProductColor(10)
        await productCard.increaseProductQuantity(1)

        await expect(page.getByRole('heading', { name: 'You found a crash bug' })).toBeVisible({timeout:60000});

    })
})


