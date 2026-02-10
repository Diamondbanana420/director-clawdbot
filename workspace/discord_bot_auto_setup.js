/**
 * XeriacoBot2 Discord Commands
 * Marketing and store automation for XeriaCO
 */

const { EmbedBuilder } = require('discord.js');

class XeriaCODiscordCommands {
  constructor(storeAPI) {
    this.storeAPI = storeAPI;
    this.setupCommands();
  }

  setupCommands() {
    this.commands = new Map([
      // Store monitoring commands
      ['store-status', {
        description: 'Get complete XeriaCO store status',
        handler: this.storeStatus.bind(this)
      }],
      ['new-products', {
        description: 'Show latest products ready for promotion',
        handler: this.newProducts.bind(this)
      }],
      ['sales-report', {
        description: 'Generate daily sales and profit report',
        handler: this.salesReport.bind(this)
      }],
      
      // Marketing automation commands
      ['promote-product', {
        description: 'Generate marketing content for a product',
        options: [{
          name: 'product',
          type: 'STRING',
          description: 'Product name to promote',
          required: true
        }],
        handler: this.promoteProduct.bind(this)
      }],
      ['social-campaign', {
        description: 'Create social media campaign',
        options: [{
          name: 'platform',
          type: 'STRING',
          description: 'Social platform (instagram, tiktok, twitter)',
          required: true,
          choices: [
            { name: 'Instagram', value: 'instagram' },
            { name: 'TikTok', value: 'tiktok' }, 
            { name: 'Twitter/X', value: 'twitter' }
          ]
        }],
        handler: this.socialCampaign.bind(this)
      }],
      ['flash-sale', {
        description: 'Announce flash sale with countdown',
        options: [{
          name: 'duration',
          type: 'INTEGER',
          description: 'Sale duration in hours',
          required: true
        }],
        handler: this.flashSale.bind(this)
      }],
      
      // Customer service commands
      ['customer-help', {
        description: 'Customer service automation',
        options: [{
          name: 'query',
          type: 'STRING',
          description: 'Customer question or issue',
          required: true
        }],
        handler: this.customerHelp.bind(this)
      }],
      ['track-order', {
        description: 'Help customer track their order',
        options: [{
          name: 'order_id',
          type: 'STRING',
          description: 'Order ID to track',
          required: true
        }],
        handler: this.trackOrder.bind(this)
      }],
      
      // Analytics commands
      ['marketing-analytics', {
        description: 'Show marketing performance metrics',
        handler: this.marketingAnalytics.bind(this)
      }],
      ['competitor-watch', {
        description: 'Check competitor activity',
        handler: this.competitorWatch.bind(this)
      }]
    ]);
  }

  async storeStatus(interaction) {
    try {
      const [products, orders, health] = await Promise.all([
        this.fetchAPI('/api/products'),
        this.fetchAPI('/api/orders'),
        this.fetchAPI('/api/health')
      ]);

      const totalProfit = products.products.reduce((sum, p) => sum + p.profitAud, 0);
      const draftCount = products.products.filter(p => p.shopifyStatus === 'draft').length;

      const embed = new EmbedBuilder()
        .setTitle('🏪 XeriaCO Store Dashboard')
        .setColor(0x2ECC71)
        .addFields(
          { name: '📦 Products', value: `${products.pagination.total} active\\n${draftCount} pending sync`, inline: true },
          { name: '💰 Profit Potential', value: `$${totalProfit.toFixed(2)} AUD`, inline: true },
          { name: '📋 Orders', value: `${orders.pagination.total} total`, inline: true },
          { name: '⚡ System Health', value: `${health.status}\\nUptime: ${Math.floor(health.uptime/3600)}h`, inline: true },
          { name: '🎯 Marketing Ready', value: `${products.pagination.total - draftCount} products live`, inline: true },
          { name: '💡 Next Action', value: draftCount > 0 ? `Sync ${draftCount} products!` : 'Drive traffic! 🚀', inline: true }
        )
        .setFooter({ text: 'XeriacoBot2 • Store Guardian' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply('❌ Failed to fetch store status');
    }
  }

  async newProducts(interaction) {
    try {
      const products = await this.fetchAPI('/api/products');
      const latestProducts = products.products.slice(0, 3);

      const embed = new EmbedBuilder()
        .setTitle('🆕 Latest XeriaCO Products - Ready to Promote!')
        .setColor(0xFF6B6B)
        .setDescription('These products are perfect for your next marketing campaign! 🚀');

      latestProducts.forEach((product, index) => {
        const profitMargin = ((product.profitAud / product.sellingPriceAud) * 100).toFixed(1);
        embed.addFields({
          name: `${index + 1}. ${product.title}`,
          value: `💎 **$${product.sellingPriceAud} AUD** | 💰 **$${product.profitAud.toFixed(2)} profit** (${profitMargin}% margin)\\n🎯 ${this.getMarketingTip(product)}\\n🏷️ Tags: ${product.tags.join(', ')}`,
          inline: false
        });
      });

      embed.setFooter({ text: `Use /promote-product to generate marketing content!` });

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply('❌ Failed to fetch products');
    }
  }

  async promoteProduct(interaction) {
    const productName = interaction.options.getString('product');
    
    const marketingContent = this.generateMarketingContent(productName);
    
    const embed = new EmbedBuilder()
      .setTitle(`🚀 Marketing Campaign: ${productName}`)
      .setColor(0x9B59B6)
      .addFields(
        { 
          name: '📱 Instagram Post', 
          value: `\`\`\`${marketingContent.instagram}\`\`\``, 
          inline: false 
        },
        { 
          name: '🐦 Twitter/X Post', 
          value: `\`\`\`${marketingContent.twitter}\`\`\``, 
          inline: false 
        },
        { 
          name: '💬 Discord Announcement', 
          value: `\`\`\`${marketingContent.discord}\`\`\``, 
          inline: false 
        },
        { 
          name: '📧 Email Subject Lines', 
          value: marketingContent.emailSubjects.join('\\n'), 
          inline: false 
        },
        { 
          name: '🎯 Target Audience', 
          value: marketingContent.audience, 
          inline: true 
        },
        { 
          name: '⏰ Best Posting Times', 
          value: marketingContent.timing, 
          inline: true 
        }
      )
      .setFooter({ text: 'Copy and customize for your campaigns!' });

    await interaction.reply({ embeds: [embed] });
  }

  async socialCampaign(interaction) {
    const platform = interaction.options.getString('platform');
    
    const campaigns = {
      instagram: {
        title: '📱 Instagram Campaign Strategy',
        color: 0xE1306C,
        content: {
          'Story Ideas': '• Product unboxing videos\\n• Behind-the-scenes content\\n• Customer testimonial reposts\\n• Flash sale countdowns',
          'Post Types': '• Carousel showcasing product features\\n• Lifestyle shots with products\\n• User-generated content\\n• Influencer collaborations',
          'Hashtags': '#XeriaCO #TechGadgets #SmartLiving #TechDeals #Innovation #Lifestyle #MustHave',
          'Best Times': 'Monday-Friday 11am-1pm, 7pm-9pm AEST'
        }
      },
      tiktok: {
        title: '🎵 TikTok Campaign Strategy', 
        color: 0xFF0050,
        content: {
          'Video Ideas': '• Product reveal transitions\\n• "POV: You find the perfect gadget"\\n• Before/after demonstrations\\n• Trending sound adaptations',
          'Hooks': '• "This gadget changed my life..."\\n• "POV: You see this on your FYP"\\n• "Things I wish I knew before buying"\\n• "Wait until you see what this does"',
          'Hashtags': '#XeriaCO #TechTok #GadgetTok #TechReview #TechDeals #FYP #Viral',
          'Best Times': 'Tuesday-Thursday 6am-10am, 7pm-9pm AEST'
        }
      },
      twitter: {
        title: '🐦 Twitter/X Campaign Strategy',
        color: 0x1DA1F2, 
        content: {
          'Tweet Types': '• Product launch announcements\\n• Tech tips and tricks\\n• Customer success stories\\n• Industry news commentary',
          'Thread Ideas': '• "7 reasons why [product] is essential"\\n• "My honest review of [product]"\\n• "How [product] solved my problem"',
          'Hashtags': '#XeriaCO #TechDeals #Innovation #SmartTech #TechCommunity #Startup',
          'Best Times': 'Monday-Friday 9am-10am, 12pm-3pm AEST'
        }
      }
    };

    const campaign = campaigns[platform];
    const embed = new EmbedBuilder()
      .setTitle(campaign.title)
      .setColor(campaign.color)
      .setDescription(`Complete ${platform} marketing strategy for XeriaCO! 🚀`);

    Object.entries(campaign.content).forEach(([key, value]) => {
      embed.addFields({ name: key, value: value, inline: false });
    });

    embed.setFooter({ text: `Ready to dominate ${platform}! 💪` });

    await interaction.reply({ embeds: [embed] });
  }

  async flashSale(interaction) {
    const duration = interaction.options.getInteger('duration');
    const endTime = new Date(Date.now() + duration * 60 * 60 * 1000);
    
    const embed = new EmbedBuilder()
      .setTitle('⚡ FLASH SALE ALERT! ⚡')
      .setColor(0xFF0000)
      .setDescription(`🔥 **LIMITED TIME OFFER** 🔥\\n\\nEverything must go! Get your XeriaCO favorites before they're gone!`)
      .addFields(
        { name: '⏰ Sale Duration', value: `${duration} hours only!`, inline: true },
        { name: '⏳ Ends', value: `<t:${Math.floor(endTime.getTime()/1000)}:R>`, inline: true },
        { name: '💥 Discount', value: '🎯 Special flash pricing!', inline: true },
        { name: '🛒 Shop Now', value: '[XeriaCO Store](https://xeriacofinal.vercel.app)', inline: false },
        { name: '📱 Share This', value: 'Tag your friends! They need to see this! 👥', inline: false }
      )
      .setFooter({ text: 'First come, first served! ⚡' })
      .setTimestamp();

    // Auto-post to marketing channel if configured
    await interaction.reply({ content: '@everyone', embeds: [embed] });
    
    // Set reminder to end sale
    setTimeout(() => {
      const endEmbed = new EmbedBuilder()
        .setTitle('⏰ Flash Sale ENDED!')
        .setColor(0x95A5A6)
        .setDescription('Thanks to everyone who participated! Stay tuned for the next sale! 🙏');
      
      interaction.followUp({ embeds: [endEmbed] });
    }, duration * 60 * 60 * 1000);
  }

  generateMarketingContent(productName) {
    return {
      instagram: `🔥 NEW DROP ALERT! 🔥\\n\\n${productName} just landed at XeriaCO! \\n\\n✨ Why you need this:\\n• Game-changing innovation\\n• Premium quality guaranteed\\n• Limited stock available\\n\\n💫 Don't sleep on this one! Link in bio 🛒\\n\\n#XeriaCO #TechInnovation #MustHave`,
      
      twitter: `🚨 JUST DROPPED: ${productName}!\\n\\n🔥 This is about to change the game\\n💡 Innovation meets affordability\\n⚡ Limited quantities available\\n\\nWho's getting theirs first? 👀\\n\\n🛒 Shop now: [link]\\n\\n#XeriaCO #TechDrop #Innovation`,
      
      discord: `@everyone 🚨 **${productName}** just dropped! 🚨\\n\\nThis is the product everyone's been waiting for! 🔥\\n\\n💎 Premium quality\\n⚡ Unbeatable value\\n🚀 Limited stock\\n\\nWho's claiming theirs? Drop a 🔥 below! \\n\\n🛒 Get yours: [link]`,
      
      emailSubjects: [
        `🔥 JUST DROPPED: ${productName} - Limited Stock!`,
        `⚡ New Arrival Alert: ${productName} is here!`,
        `🚨 Don't miss out: ${productName} now available!`,
        `💥 Game-changer alert: ${productName} has arrived!`
      ],
      
      audience: 'Tech enthusiasts, early adopters, value-conscious shoppers, social media savvy millennials',
      timing: 'Peak engagement: Mon-Fri 11am-1pm, 7pm-9pm AEST'
    };
  }

  getMarketingTip(product) {
    const tips = [
      'Perfect for lifestyle influencer partnerships! 📸',
      'Great for unboxing videos and reviews! 🎬', 
      'Trending product - capitalize on the hype! 🔥',
      'High margin = perfect for affiliate campaigns! 💰',
      'Visual appeal makes it Instagram-ready! ✨'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  async fetchAPI(endpoint) {
    // This would connect to your store API
    // For now, return mock data
    if (endpoint === '/api/products') {
      return {
        products: [
          {
            title: 'Smart Ring - Health & Fitness Tracker',
            sellingPriceAud: 79.99,
            profitAud: 24.21,
            tags: ['health', 'fitness', 'wearable'],
            shopifyStatus: 'draft'
          }
        ],
        pagination: { total: 7 }
      };
    }
    return { pagination: { total: 0 } };
  }
}

module.exports = XeriaCODiscordCommands;