const { Deal, Supplier, Buyer, Forwarder, CompanyGroup, Price, Tonn } = require('../models');
const sequelize = require('../config/database');


const toCommaSeparatedString = (arr) => {
  if (!arr) return null;
  return arr.map(item => item.name).join(',')
};

exports.createDeal = async (req, res) => {
  const data = req.body;

  let deal = await Deal.create(data)

  return res.json(deal);
};

exports.deleteDeal = async (req, res) => {
  try {
    const dealId = req.params.id;  // Get the id from the URL

    const result = await Deal.destroy({
        where: {
            id: dealId
        }
    });

    if (result === 0) {
        return res.status(404).json({ message: 'Сделка не найдена' });
    }

    // Send a success response
    res.status(200).json({ message: 'Сделка успешно удалена!' });
  } catch (error) {
      console.error('Error deleting deal:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
  }
}

exports.updateDeal = async (req, res) => {
  const { header, supplier, buyer, forwarder, company } = req.body;

  try {
    // Validate required fields
    if (!header || !header.dealNumber) {
      return res.status(400).json({ message: "Invalid input: missing dealNumber" });
    }

    // Begin a transaction
    const transaction = await sequelize.transaction();

    try {
      let deal = await Deal.findOne({ where: { dealNumber: header.dealNumber, type: header.type }, transaction });
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }

      // Update the deal header
      await deal.update(header, { transaction });

      // Update supplier
      if (supplier) {
        const [supply, created] = await Supplier.findOrCreate({
          where: { dealId: deal.id },
          defaults: {...supplier, dealId: deal.id},
          transaction,
        });

        if (!created) {
          await supply.update(supplier, { transaction });
        }

        // Clear old prices and tonns for supplier
        await Price.destroy({ where: { supplierId: supply.id }, transaction });
        await Tonn.destroy({ where: { supplierId: supply.id }, transaction });

        // Bulk insert new prices and tonns for supplier
        if (supplier.Prices && Array.isArray(supplier.Prices)) {
          await Price.bulkCreate(
            supplier.Prices.map(priceData => ({ supplierId: supply.id, ...priceData })),
            { transaction }
          );
        }

        if (supplier.Tonns && Array.isArray(supplier.Tonns)) {
          await Tonn.bulkCreate(
            supplier.Tonns.map(tonnData => ({ supplierId: supply.id, ...tonnData })),
            { transaction }
          );
        }
      }

      // Update buyer
      if (buyer) {
        const [buy, created] = await Buyer.findOrCreate({
          where: { dealId: deal.id },
          defaults: {...buyer, dealId: deal.id},
          transaction,
        });

        if (!created) {
          await buy.update(buyer, { transaction });
        }

        // Clear old prices and tonns for buyer
        await Price.destroy({ where: { buyerId: buy.id }, transaction });
        await Tonn.destroy({ where: { buyerId: buy.id }, transaction });

        // Bulk insert new prices and tonns for buyer
        if (buyer.Prices && Array.isArray(buyer.Prices)) {
          await Price.bulkCreate(
            buyer.Prices.map(priceData => ({ buyerId: buy.id, ...priceData })),
            { transaction }
          );
        }

        if (buyer.Tonns && Array.isArray(buyer.Tonns)) {
          await Tonn.bulkCreate(
            buyer.Tonns.map(tonnData => ({ buyerId: buy.id, ...tonnData })),
            { transaction }
          );
        }
      }

      // Update forwarder
      if (forwarder) {
        const [forward, created] = await Forwarder.findOrCreate({
          where: { dealId: deal.id },
          defaults: {...forwarder, dealId: deal.id},
          transaction,
        });

        if (!created) {
          await forward.update(forwarder, { transaction });
        }
      }

      // Update company group
      if (company) {
        const [com, created] = await CompanyGroup.findOrCreate({
          where: { dealId: deal.id },
          defaults: {
            ...company,
            dealId: deal.id,
            names: toCommaSeparatedString(company.names),
          },
          transaction,
        });

        if (!created) {
          await com.update(
            {
              ...company,
              names: toCommaSeparatedString(company.names),
            },
            { transaction }
          );
        }

        // Clear old prices for company group
        await Price.destroy({ where: { companyId: com.id }, transaction });

        // Bulk insert new prices for company group
        if (company.Prices && Array.isArray(company.Prices)) {
          await Price.bulkCreate(
            company.Prices.map(priceData => ({ companyId: com.id, ...priceData })),
            { transaction }
          );
        }
      }

      // Commit the transaction if everything is successful
      await transaction.commit();

      // Return updated deal
      return res.json(deal);
    } catch (error) {
      // If any error occurs, rollback the transaction
      await transaction.rollback();
      console.error('Transaction error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error updating deal:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getDeals = async (req, res) => {
  try {
    const deals = await Deal.findAll({
      order: [['dealNumber', 'ASC']],
      include: [
        {
          model: Supplier,
          include: [Price, Tonn]
        },
        {
          model: Buyer,
          include: [Tonn, Price]
        },
        {
          model: Forwarder
        },
        {
          model: CompanyGroup,
          include: [Price]
        }
      ]
    });

    // Transform deals to combine Prices and Tonns into Entries for Supplier and Buyer
    const transformedDeals = deals.map((deal) => {
      const supplier = deal.Supplier ? {
        ...deal.Supplier.toJSON(),
        Entries: mergeEntries(deal.Supplier.Prices, deal.Supplier.Tonns)
      } : null;

      const buyer = deal.Buyer ? {
        ...deal.Buyer.toJSON(),
        Entries: mergeEntries(deal.Buyer.Prices, deal.Buyer.Tonns)
      } : null;

      const companyGroup = deal.CompanyGroup ? {
        ...deal.CompanyGroup.toJSON(),
        Entries: mergeEntries(deal.CompanyGroup.Prices, []) // No Tonns in CompanyGroup
      } : null;

      return {
        ...deal.toJSON(),
        Supplier: supplier,
        Buyer: buyer,
        CompanyGroup: companyGroup
      };
    });

    return res.json(transformedDeals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve deals' });
  }
};


const mergeEntries = (prices = [], tonns = []) => {
  const maxLength = Math.max(prices.length, tonns.length);
  const entries = [];

  for (let i = 0; i < maxLength; i++) {
    entries.push({
      ...prices[i]?.toJSON(),
      ...tonns[i]?.toJSON()
    });
  }

  return entries;
};

function createUniqueKey(priceData) {
  // Create a unique key based on a combination of attributes
  return `${priceData.quotation}-${priceData.discount}-${priceData.price}-${priceData.currency}-${priceData.commentary || ''}`;
}