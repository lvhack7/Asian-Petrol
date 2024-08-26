const { Deal, Supplier, Buyer, Forwarder, CompanyGroup, Price } = require('../models');

exports.createDeal = async (req, res) => {
  const data = req.body;

  let deal = await Deal.create(data)

  return res.json(deal);
};

exports.updateDeal = async (req, res) => {
  const {header, supplier, buyer, forwarder, company} = req.body
  let deal = await Deal.findOne({where: {dealNumber: header.dealNumber}})
  if (!deal) {
    return res.status(400).json({message: "Not found"})
  }

  await deal.update(header)

  if (supplier) {
    const [supply, created] = await Supplier.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: supplier // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await supply.update(supplier);
    }

    // Delete all existing prices for the supplier
    await Price.destroy({ where: { supplierId: supply.id } });

    // Add new prices from the request
    if (supplier.Prices && Array.isArray(supplier.Prices)) {
      for (const priceData of supplier.Prices) {
        await Price.create({
          supplierId: supply.id,
          ...priceData
        });
      }
    }
  }

  if (buyer) {
    const [buy, created] = await Buyer.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: buyer // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await buy.update(buyer);
    }

    // Delete all existing prices for the supplier
    await Price.destroy({ where: { buyerId: buy.id } });
    
    // Add new prices from the request
    if (buyer.Prices && Array.isArray(buyer.Prices)) {
      for (const priceData of buyer.Prices) {
        await Price.create({
          buyerId: buy.id,
          ...priceData
        });
      }
    }
  }

  if (forwarder) {
    const [forward, created] = await Forwarder.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: forwarder // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await forward.update(forwarder);
    }
  }

  const toCommaSeparatedString = (arr) => arr.map(item => item.name).join(',');

  if(company) {
    console.log("COMP: ", company)
    const [com, created] = await CompanyGroup.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: {...company, names: toCommaSeparatedString(company.names)} // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await com.update({...company, names: toCommaSeparatedString(company.names)});
    }
  }

  return res.json(deal)
}

exports.getDeals = async (req, res) => {
  const deals = await Deal.findAll({
    order: [['dealNumber', 'ASC']],
    include: [
      {
        model: Supplier,
        include: [Price] // Include prices associated with the supplier
      },
      {
        model: Buyer,
        include: [Price]
      },
      {
        model: Forwarder
      },
      {
        model: CompanyGroup
      }
    ]
  });
  return res.json(deals);
};


function createUniqueKey(priceData) {
  // Create a unique key based on a combination of attributes
  return `${priceData.quotation}-${priceData.discount}-${priceData.price}-${priceData.currency}-${priceData.commentary || ''}`;
}