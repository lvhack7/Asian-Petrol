import React, { useEffect, useState } from 'react'
import dealService from '../services/dealService'
import { Table, Button, notification, Typography } from 'antd';

const {Text} = Typography


function formatNumber(number) {
  if (!number) return '';

  // Check if the input is a string and can be parsed into a valid number
  const num = typeof number === 'string' ? parseFloat(number.replace(',', '.').replace(/\s/g, '')) : number;

  // If not a valid number, return an empty string
  if (isNaN(num)) return number;

  return num.toLocaleString('ru-RU', {
    minimumFractionDigits: 0
  }).replace(/\s/g, ' ').replace(',', '.'); // Ensures space separator for thousands
}

const fuelColorMapping = {
  "ВГО": "#a2b5dc",
  "ВГО 2%": "#dbe0ef",
  "Мазут": "#b5d8a4",
  "ДТ": "#ddd5c3",
  "Нефть": "#d3956e",
  "АИ-92 К4": "#f0b04c",
  "АИ-92 К5": "#f8e08d",
  "Нефрас": "#5473a6",
  "Газ": "#9e9a94",
  "Печное топливо": "#858793",
  "Авиакеросин": "#a69784",
  "ДТЗ-К4/К5": "#d2cdc0",
  "АИ-92 К4/К5": "#f1c653",
  "Аи-95-К4": "#f9e4a3",
  "Аи-95": "#f9e4a3",
  "АИ-80": "#b5d8a4",
  "Кокс": "#af853c",
  "Параксилол": "#6fc5e7",
  "Судовое топливо": "#bde4df",
  "Нафта": "#aaa8a4",
  "ДТ-А-К5": "#f9e465",
  "АИ-98": "#a6e5b4"
};

const columns = [
    {
        title: 'Тип', // Type
        dataIndex: 'type',
        key: 'type',
        render: (text) => text || '',
    },
    {
      title: 'Номер сделки', // Deal Number
      dataIndex: 'dealNumber',
      key: 'dealNumber',
      render: (text) => text || '',
    },
    {
      title: 'Дата', // Date
      dataIndex: 'date',
      key: 'date',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Фабрика', // Factory
      dataIndex: 'factory',
      key: 'factory',
      render: (text) => text || '',
    },
    {
      title: 'Вид ГСМ', // Factory
      dataIndex: 'fuelType',
      key: 'fuelType',
      render: (text) => ({
        props: {
          style: {
            backgroundColor: fuelColorMapping[text], // Background color for the entire cell
            padding: '10px',
          },
        },
        children: <div>{text}</div>,
      }),
    },
    {
      title: 'Содержание серы, %', // Sulfur Content
      dataIndex: 'sulfur',
      key: 'sulfur',
      render: (text) => text || '',
    },
    {
      title: 'Поставщик', // Supplier Name
      dataIndex: ['Supplier', 'name'],
      key: 'supplierName',
      render: (text) => text || '',
    },
    {
      title: '№ договор / приложение', // Supplier Contract Number
      dataIndex: ['Supplier', 'contractNumber'],
      key: 'supplierContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Законтрактовано по приложению', // Supplier Volume
      dataIndex: ['Supplier', 'volume'],
      key: 'supplierVolume',
      render: (text) => text || '',
    },
    {
      title: 'Сумма по приложению', // Supplier Amount
      dataIndex: ['Supplier', 'amount'],
      key: 'supplierAmount',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Условия поставки', // Delivery Basis
      dataIndex: ['Supplier', 'deliveryBasis'],
      key: 'deliveryBasis',
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition
      dataIndex: ['Supplier', 'fixationCondition'],
      key: 'fixationCondition',
      render: (text) => text || '',
    },
    {
      title: 'Дата загрузки', // Fill Date
      dataIndex: ['Supplier', 'fillDate'],
      key: 'fillDate',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Налив поставщик',
      key: 'suppTonns',
      render: (record) => (
        <>
          {record.Supplier && record.Supplier.Tonns && record.Supplier.Tonns.length > 0 ? (
            record.Supplier.Tonns.map((tonn, index) => (
              <div key={index} className="flex flex-col mt-3">
                <div>
                  <strong>Тонн:</strong> {formatNumber(tonn.tonn)}
                </div>
                <div>
                  <strong>Дата:</strong> {new Date(tonn.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'Цены поставщика', // Supplier Prices
      key: 'supplierPrices',
      render: (record) => (
        <>
          {record.Supplier && record.Supplier.Prices && record.Supplier.Prices.length > 0 ? (
            record.Supplier.Prices.map((price, index) => (
              <div key={index} className="flex flex-col mt-3">
              <div>
                <strong>Цена:</strong> {formatNumber(price.price)} {price.currency}
              </div>
              <div>
                <strong>Скидка:</strong> {price.discount}
              </div>
              <div>
                <strong>Котировка:</strong> {price.quotation}
              </div>
            </div>
            ))
          ) : (
            ''
          )}
        </>
      )
    },
    {
      title: 'Сумма  отгрузки, (факт)', // Supplier Amount
      key: 'supplierAmount1',
      render: (record) => {
        return formatNumber(Number(record?.Supplier?.Prices[0]?.price) * Number(record?.Supplier?.volume))
      } 
    },
    {
      title: 'Покупатель', // Buyer Name
      dataIndex: ['Buyer', 'name'],
      key: 'buyerName',
      render: (text) => text || '',
    },
    {
      title: 'Номер контракта покупателя', // Buyer Contract Number
      dataIndex: ['Buyer', 'contractNumber'],
      key: 'buyerContractNumber',
      render: (text) => text || '',
    },
    {
      title: 'Объем покупателя', // Buyer Volume
      dataIndex: ['Buyer', 'volume'],
      key: 'buyerVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Законтракт. на сумму', // Buyer Amount
      dataIndex: ['Buyer', 'amount'],
      key: 'buyerAmount',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Условия поставки', // Delivery Basis (Buyer)
      dataIndex: ['Buyer', 'deliveryBasis'],
      key: 'buyerDeliveryBasis',
      render: (text) => text || '',
    },
    {
      title: 'Условия фиксации', // Fixation Condition (Buyer)
      dataIndex: ['Buyer', 'fixationCondition'],
      key: 'buyerFixationCondition',
      render: (text) => text || '',
    },
    {
      title: 'Заявленный объем', // Declared Volume
      dataIndex: ['Buyer', 'declared'],
      key: 'declaredVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Объем разгрузки', // Discharge Volume
      dataIndex: ['Buyer', 'dischargeVolume'],
      key: 'dischargeVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Дата разгрузки', // Discharge Date
      dataIndex: ['Buyer', 'dischargeDate'],
      key: 'dischargeDate',
      render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
    {
      title: 'Отгрузка покупателя',
      key: 'buyTonns',
      render: (record) => (
        <>
          {record.Buyer && record.Buyer.Tonns && record.Buyer.Tonns.length > 0 ? (
            record.Buyer.Tonns.map((tonn, index) => (
              <div key={index} className="flex flex-col mt-3">
                <div>
                  <strong>Тонн:</strong> {formatNumber(tonn.tonn)}
                </div>
                <div>
                  <strong>Дата:</strong> {new Date(tonn.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'Цены покупателя', // Supplier Prices
      key: 'buyerPrices',
      render: (record) => (
        <>
          {record.Buyer && record.Buyer.Prices && record.Buyer.Prices.length > 0 ? (
            record.Buyer.Prices.map((price, index) => (
              <div key={index} className="flex flex-col mt-3">
              <div>
                <strong>Цена:</strong> {formatNumber(price.price)} {price.currency}
              </div>
              <div>
                <strong>Скидка:</strong> {price.discount}
              </div>
              <div>
                <strong>Котировка:</strong> {price.quotation}
              </div>
            </div>
            ))
          ) : (
            ''
          )}
        </>
      ),
    },
    {
      title: 'Отгружено на сумму', // Supplier Amount
      key: 'supplierAmount2',
      render: (record) => {
        return formatNumber(Number(record?.Buyer?.Prices[0]?.price) * Number(record?.Buyer?.volume))
      } 
    },
    {
      title: 'Экспедитор', // Forwarder Name
      dataIndex: ['Forwarder', 'name'],
      key: 'forwarderName',
      render: (text) => text || '',
    },
    {
      title: 'Компания группы', // Group Company
      dataIndex: ['Forwarder', 'groupCompany'],
      key: 'groupCompany',
      render: (text) => text || '',
    },
    {
      title: 'ж/д тариф план', // Planned Railway Tariff
      dataIndex: ['Forwarder', 'plannedRailwayTariff'],
      key: 'plannedRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'Кол-во груза предварит. MT', // Cargo Amount MT
      dataIndex: ['Forwarder', 'cargoAmountMT'],
      key: 'cargoAmountMT',
      render: (text) => text || '',
    },
    {
      title: 'Сумма начисленная предварит.', // Accrued Amount
      dataIndex: ['Forwarder', 'accruedAmount'],
      key: 'accruedAmount',
      render: (text) => formatNumber(text),
    },
    {
      title: 'ж/д тариф факт', // Actual Railway Tariff
      dataIndex: ['Forwarder', 'actualRailwayTariff'],
      key: 'actualRailwayTariff',
      render: (text) => text || '',
    },
    {
      title: 'Фактически отгруженный объем, МТ', // Actual Shipped Volume MT
      dataIndex: ['Forwarder', 'actualShippedVolumeMT'],
      key: 'actualShippedVolumeMT',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Факт. объем по счету-фактуре, МТ', // Actual Volume Invoice MT
      dataIndex: ['Forwarder', 'actualVolumeInvoiceMT'],
      key: 'actualVolumeInvoiceMT',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Сумма по счету-фактуре на фактич. объем', // Invoice Amount Actual Volume
      dataIndex: ['Forwarder', 'invoiceAmountActualVolume'],
      key: 'invoiceAmountActualVolume',
      render: (text) => formatNumber(text),
    },
    {
      title: 'Охрана', // Security
      dataIndex: ['Forwarder', 'security'],
      key: 'security',
      render: (text) => text || '',
    },
    {
      title: 'Сверхнормативы (высокое)', // Excess High
      dataIndex: ['Forwarder', 'excessHigh'],
      key: 'excessHigh',
      render: (text) => text || '',
    },
    {
      title: 'Сверхнормативы (переведенное)', // Excess Transferred
      dataIndex: ['Forwarder', 'excessTransferred'],
      key: 'excessTransferred',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (высокое)', // Penalties High
      dataIndex: ['Forwarder', 'penaltiesHigh'],
      key: 'penaltiesHigh',
      render: (text) => text || '',
    },
    {
      title: 'Штрафы (переведенные)', // Penalties Transferred
      dataIndex: ['Forwarder', 'penaltiesTransferred'],
      key: 'penaltiesTransferred',
      render: (text) => text || '',
    },
    {
        title: 'Дополнительные расходы', // Additional Costs
        dataIndex: ['Forwarder', 'additionalCosts'],
        key: 'additionalCosts',
        render: (text) => text || '',
    },
    {
        title: 'Заполненный объем', // Volume Filled
        dataIndex: ['Forwarder', 'volumeFilled'],
        key: 'volumeFilled',
        render: (text) => formatNumber(text),
    },
    {
        title: 'Дата загрузки', // Fill Date
        dataIndex: ['Forwarder', 'fillDate'],
        key: 'forwarderFillDate',
        render: (text) => (text ? <Text>{new Date(text).toLocaleDateString()}</Text> : ''),
    },
      {
        title: 'Группа компании', // Buyer Prices
        key: 'companyGroups',
        dataIndex: ['CompanyGroup', 'names'],
        render: (text) => text || '',
      },
      {
        title: 'Цены Группа компаний', // Supplier Prices
        key: 'companyPrices',
        render: (record) => (
          <>
            {record.CompanyGroup && record.CompanyGroup.Prices && record.CompanyGroup.Prices.length > 0 ? (
              record.CompanyGroup.Prices.map((price, index) => (
                <div key={index} className="flex flex-col mt-3">
              <div>
                <strong>Цена:</strong> {formatNumber(price.price)} {price.currency}
              </div>
              <div>
                <strong>Скидка:</strong> {price.discount}
              </div>
              <div>
                <strong>Котировка:</strong> {price.quotation}
              </div>
            </div>
              ))
            ) : (
              ''
            )}
          </>
        ),
      },
]

const PassportPage = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      fetchDeals()
  }, [])

  const fetchDeals = async () => {
      setLoading(true)
      try {
        const { data } = await dealService.getDeals();
        console.log("DATA: ", data)
        setDeals(data);
      } catch (error) {
        localStorage.removeItem('token');
        notification.error({ message: 'Не удалось получить сделки!' });
      } finally {
        setLoading(false);
      }
  };

  const KZDeals = deals.filter((deal) => deal.type === 'KZ');
  const KGDeals = deals.filter((deal) => deal.type === 'KG');

  return (
    <>
      <h2 className='font-semibold text-2xl mb-4'>KZ Паспорт</h2>
      <Table
        className='overflow-x-auto'
        columns={columns}
        dataSource={KZDeals}
        rowKey="dealNumber"
        bordered
        loading={loading}
        pagination={false} // Add pagination if needed
      />

      <h2 className='font-semibold text-2xl mb-4 mt-16'>KG Паспорт</h2>
      <Table
        className='overflow-x-auto'
        columns={columns}
        dataSource={KGDeals}
        rowKey="dealNumber"
        bordered
        loading={loading}
        pagination={false} // Add pagination if needed
      />
    </>
  );
}

export default PassportPage