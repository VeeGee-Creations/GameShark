import axios from 'axios';


const productUrl = 'https://www.epicgames.com/store/en-US/p/'


export default async function searchCatalog() {
    const epicAPI = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';
    let catalog =[];
    let current =[];
    let upcoming =[];

    await axios.get(epicAPI).then(response => {
        catalog = response.data.data.Catalog.searchStore.elements;
    }).catch(error => {
        console.error(error);
    });

    const promotional = catalog.filter(game => {
        return game.promotions !== null;
    }).map(promotion => {
        return {
            title: promotion.title,
            slug: promotion.productSlug,
            price: promotion.price,
            promotion: promotion.promotions
        };
    });

    console.log(promotional);
}