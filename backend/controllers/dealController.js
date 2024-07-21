const { Deal, Supplier, Buyer, Forwarder } = require('../models');

exports.createDeal = async (req, res) => {
  const { dealNumber, date, factory, fuelType, type, data } = req.body;

  let deal = await Deal.findOne({where: {dealNumber}});;

  if (deal) {
    // Update existing deal
    await deal.update({ dealNumber, date, factory, fuelType });

    if (type === "supplier") await Supplier.update(data, { where: { dealId: deal.id } });
    if (type === "buyer") await Buyer.update(data, { where: { dealId: deal.id } });
    if (type === "forwarder") await Forwarder.update(data, { where: { dealId: deal.id } });
  } else {
    // Create new deal
    deal = await Deal.create({ dealNumber, date, factory, fuelType });

    if (type === "supplier") await Supplier.create({ ...data, dealId: deal.id });
    if (type === "buyer") await Buyer.create({ ...data, dealId: deal.id });
    if (type === "forwarder") await Forwarder.create({ ...data, dealId: deal.id });
  }

  res.json(deal);
};

exports.getDeals = async (req, res) => {
  const deals = await Deal.findAll({
    order: [['dealNumber', 'ASC']],
    include: [Supplier, Buyer, Forwarder]
  });
  res.json(deals);
};