const axios = require('axios');

module.exports = {
    name: 'epic',
    description: 'Free Epic Games',
    async execute(message, args, Discord) {
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
                promotion: promotion.promotions,
                images: promotion.keyImages
            };
        });

        const productUrl = 'https://www.epicgames.com/store/en-US/p/'

        switch (args[0]) {
            case 'current':
                const current = promotional.filter(promotion => {
                    return promotion.promotion.promotionalOffers.length > 0
                });

                if (current.length > 0) return current.forEach(game => {
                    const currentGameEmbed = new Discord.MessageEmbed()
                        .setColor('#304281')
                        .setTitle(game.title)
                        .setURL(`${productUrl}${game.slug}`)
                        .setDescription('Current Epic promotion')
                        .addFields(
                            {name: "Start Date", value: new Date(game.promotion.promotionalOffers[0].promotionalOffers[0].startDate).toLocaleDateString('en-US')},
                            {name: "End Date", value: new Date(game.promotion.promotionalOffers[0].promotionalOffers[0].endDate).toLocaleDateString('en-US')},
                            {name: "Original Price", value: game.price.totalPrice.fmtPrice.originalPrice},
                            {name: "Current Price", value: game.price.totalPrice.fmtPrice.discountPrice === '0' ? 'FREE' : game.price.totalPrice.fmtPrice.discountPrice}
                        )
                        .setImage(game.images[2].url)
                        .setFooter('Available in the Epic Games Store');
                    message.channel.send(currentGameEmbed);
                });

                return message.channel.send('There currently no free games');
                break;
            case 'upcoming':
                const upcoming = promotional.filter(promotion => {
                    return promotion.promotion.upcomingPromotionalOffers.length > 0
                });

                if (upcoming.length > 0) return upcoming.forEach(game => {
                    const upcomingGameEmbed = new Discord.MessageEmbed()
                        .setColor('#304281')
                        .setTitle(game.title)
                        .setURL(`${productUrl}${game.slug}`)
                        .setDescription('Upcoming Epic promotion')
                        .addFields(
                            {name: "Start Date", value: new Date(game.promotion.upcomingPromotionalOffers[0].promotionalOffers[0].startDate).toLocaleDateString('en-US')},
                            {name: "End Date", value: new Date(game.promotion.upcomingPromotionalOffers[0].promotionalOffers[0].endDate).toLocaleDateString('en-US')}
                        )
                        .setImage(game.images[2].url)
                        .setFooter('Available in the Epic Games Store');
                    message.channel.send(upcomingGameEmbed);
                });

                return message.channel.send('There are no upcoming free games');
                break;
            default:
                message.channel.send(`${args[0]} is unrecognized.\n!epic only recongizes 'current' or 'upcoming' as arguments.`)
        };
    },
};