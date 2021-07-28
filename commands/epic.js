const axios = require('axios');

async function searchCatalog(message, args) {
    const epicAPI = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';
    let catalog =[];

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

    const productUrl = 'https://www.epicgames.com/store/en-US/p/'

    switch (args[0]) {
        case 'current':
            const current = promotional.filter(promotion => {
                return promotion.promotion.promotionalOffers.length > 0
            });

            if (current.length > 0) return current.forEach(game => {
                message.channel.send(`${game.title} will be available from ${new Date(game.promotion.promotionalOffers[0].promotionalOffers[0].startDate).toLocaleDateString('en-US')} to ${new Date(game.promotion.promotionalOffers[0].promotionalOffers[0].endDate).toLocaleDateString('en-US')}\nOriginal Price: ${game.price.totalPrice.fmtPrice.originalPrice}\nCurrent Price: ${game.price.totalPrice.fmtPrice.discountPrice === '0' ? 'FREE' : game.price.totalPrice.fmtPrice.discountPrice}\n${productUrl}${game.slug}`);
            });

            return message.channel.send('There currently no free games');
            break;
        case 'upcoming':
            const upcoming = promotional.filter(promotion => {
                return promotion.promotion.upcomingPromotionalOffers.length > 0
            });

            if (upcoming.length > 0) return upcoming.forEach(game => {
                message.channel.send(
                    `${game.title} will be available from ${new Date(game.promotion.upcomingPromotionalOffers[0].promotionalOffers[0].startDate).toLocaleDateString('en-US')} to ${new Date(game.promotion.upcomingPromotionalOffers[0].promotionalOffers[0].endDate).toLocaleDateString('en-US')}\n${productUrl}${game.slug}`
                    );
            });

            return message.channel.send('There are no upcoming free games');
            break;
        default:
            message.channel.send(`${args[0]} is unrecognized.\n!epic only recongizes 'current' or 'upcoming' as arguments.`)
    };
}

module.exports = {
    name: 'epic',
    description: 'Free Epic Games',
    execute(message, args) {
        searchCatalog(message, args);
    },
};