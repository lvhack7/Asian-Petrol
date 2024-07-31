const { Deal, Supplier, Buyer, Forwarder, CompanyGroup } = require('../models');

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
  }

  if (buyer) {
    const [buy, created] = await Buyer.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: buyer // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await buy.update(supplier);
    }
  }
  if (forwarder) {
    const [forward, created] = await Forwarder.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: forwarder // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await forward.update(supplier);
    }
  }

  if(company) {
    const [com, created] = await CompanyGroup.findOrCreate({
      where: { dealId: deal.id }, // Criteria to find the user
      defaults: company // Data to use if creating a new user
    });
  
    if (!created) {
      // If the user already exists, update with new data
      await com.update(company);
    }
  }

  return res.json(deal)
}

exports.getDeals = async (req, res) => {
  const deals = await Deal.findAll({
    order: [['dealNumber', 'ASC']],
    include: { all: true }
  });
  return res.json(deals);
};